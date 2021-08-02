import * as L from 'leaflet';
import { Layer } from 'leaflet';
import * as O from 'fp-ts/lib/Option';
import * as fp from 'lodash/fp';
import { mapSvgs } from '@bit/garlictech.universal.gtrack.map-symbols/map_symbols';
import { Sprite, LoaderResource, Container } from 'pixi.js';
import { RGBColor } from 'd3';
import { DropShadowFilter } from 'pixi-filters';
import { LeafletMapMarker } from './leaflet-map-marker';
import { pipe } from 'fp-ts/lib/function';
import { quadtree } from 'd3-quadtree';
import { color as d3Color } from 'd3-color';
import { Observable, bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import { Map } from 'leaflet';

class MarkerSprite extends Sprite {
  x0: number;
  y0: number;
  id: string;
  legend: string;
  currentX?: number;
  targetX?: number;
  currentY?: number;
  targetY?: number;
  currentScale?: number;
  targetScale?: number;
  xp?: number;
  yp?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  r?: number;
  r0: number;
  cache: Array<{ x?: number; y?: number; r?: number }>;
}

const solveCollision = (circles, opts) => {
  opts = opts || {};
  const tree: any = quadtree()
    .x(d => {
      return d[0];
    })
    .y(function (d) {
      return d[1];
    });
  if (opts.extent !== undefined) tree.extent(opts.extent);
  let rMax = 0;
  circles.forEach(function (circle) {
    circle.xp = circle.x0;
    circle.yp = circle.y0;
    if (opts.r0 !== undefined) circle.r0 = opts.r0;
    circle.r = circle.r0;
    circle.xMin = circle.x0 - circle.r0;
    circle.xMax = circle.x0 + circle.r0;
    circle.yMin = circle.y0 - circle.r0;
    circle.yMax = circle.y0 + circle.r0;
    const colliding: any = [];

    function collide(d) {
      function fixCollision(node) {
        const x = d.xp - node.xp;
        const y = d.yp - node.yp;
        const l = x * x + y * y;
        const r = d.r + node.r;
        if (l < r * r) {
          const nodeClone = {
            r: node.r,
            xp: node.xp,
            yp: node.yp,
            from: node,
          };
          colliding.push(nodeClone);
          let c1, c2, lambda1, lambda2, u1, u2;
          const delta = Math.sqrt(l);
          if (d.r < nodeClone.r) {
            c1 = nodeClone;
            c2 = d;
          } else {
            c1 = d;
            c2 = nodeClone;
          }
          const r1 = c1.r;
          const r2 = c2.r;
          const alpha = (r1 + r2 + delta) / 4;
          if (l > 0) {
            u1 = (c2.xp - c1.xp) / delta;
            u2 = (c2.yp - c1.yp) / delta;
          } else {
            const theta = 2 * Math.PI * Math.random();
            u1 = Math.cos(theta);
            u2 = Math.sin(theta);
          }

          if (r2 >= alpha) {
            lambda1 = alpha / r1;
            lambda2 = alpha / r2;
          } else {
            lambda1 = (r1 - r2 + delta) / (2 * r1);
            lambda2 = 1;
          }
          c1.r *= lambda1;
          c2.r *= lambda2;
          c1.xp += (lambda1 - 1) * r1 * u1;
          c1.yp += (lambda1 - 1) * r1 * u2;
          c2.xp += (1 - lambda2) * r2 * u1;
          c2.yp += (1 - lambda2) * r2 * u2;
          c1.xMin = c1.xp - c1.r;
          c1.xMax = c1.xp + c1.r;
          c1.yMin = c1.yp - c1.r;
          c1.yMax = c1.yp + c1.r;
          c2.xMin = c2.xp - c2.r;
          c2.xMax = c2.xp + c2.r;
          c2.yMin = c2.yp - c2.r;
          c2.yMax = c2.yp + c2.r;
        }
      }
      return function (quad, x1, y1, x2, y2) {
        if (!quad.length) {
          do {
            if (
              d.xMax > quad.data.xMin &&
              d.xMin < quad.data.xMax &&
              d.yMax > quad.data.yMin &&
              d.yMin < quad.data.yMax
            ) {
              fixCollision(quad.data);
            }
          } while ((quad = quad.next));
        }
        return (
          x1 > d.xMax + rMax ||
          x2 + rMax < d.xMin ||
          y1 > d.yMax + rMax ||
          y2 + rMax < d.yMin
        );
      };
    }

    tree.visit(collide(circle));
    rMax = Math.max(rMax, circle.r);
    tree.removeAll(
      colliding.map(function (node) {
        return node.from;
      })
    );
    const newNodes = colliding.map(function (node) {
      const from = node.from;
      from.xp = node.xp;
      from.yp = node.yp;
      from.r = node.r;
      from.xMin = node.xMin;
      from.xMax = node.xMax;
      from.yMin = node.yMin;
      from.yMax = node.yMax;

      return from;
    });
    newNodes.push(circle);
    tree.addAll(newNodes);
  });

  if (opts.zoom !== undefined) {
    circles.forEach(function (circle) {
      circle.cache = circle.cache || {};
      circle.cache[opts.zoom] = {
        x: circle.xp,
        y: circle.yp,
        r: circle.r,
      };
    });
  }

  let rMax2 = 0;
  circles.forEach(function (circle) {
    rMax2 = Math.max(rMax2, circle.r);
  });
  tree.rMax = rMax2;

  return tree;
};

type ResourceMap = Partial<Record<string, LoaderResource>>;
export type MapFacade = {
  getMinZoom(): number;
  getMaxZoom(): number;
  on(event: string, cb: (e?: any) => void): void;
};

export type LayerData = {
  resources: ResourceMap;
  markers: LeafletMapMarker[];
};

const loader = PIXI.Loader.shared;

export const loadMarkers = (
  leafletMarkers: LeafletMapMarker[]
): Observable<ResourceMap> => {
  pipe(
    leafletMarkers,
    fp.map(marker => marker.iconTag),
    fp.uniq,
    fp.map(iconTag => ({
      iconTag,
      svg: `data:image/svg+xml;base64,${btoa(mapSvgs[iconTag])}`,
    })),
    fp.forEach(({ iconTag, svg }) => {
      if (!loader.resources[iconTag]) {
        loader.add(iconTag, svg);
      }
    })
  );

  return bindCallback((cb: any) => loader.load(cb))().pipe(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([__, resources]: [any, ResourceMap]) => resources)
  );
};

const doubleBuffering =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

type State = {
  firstDraw: boolean;
  prevZoom: any;
  markerSprites: MarkerSprite[];
  markers: LeafletMapMarker[];
  frame: any;
  focus: any;
  resources: ResourceMap;
};

const initialState: Partial<State> = {
  firstDraw: true,
  prevZoom: undefined,
  markerSprites: [],
  frame: null,
  focus: null,
};

let currentState = fp.cloneDeep(initialState);

const redraw = (utils: any): void => {
  const map: Map = utils.getMap();
  const zoom = map.getZoom();
  const container = utils.getContainer();
  const renderer = utils.getRenderer();
  const project = utils.latLngToLayerPoint;
  const scale = utils.getScale();
  const invScale = 1 / scale;

  if (currentState.frame) {
    cancelAnimationFrame(currentState.frame);
    currentState.frame = null;
  }

  const globalScale = 0.13;
  const convertRgbToNumber = (rgb: RGBColor) =>
    256 * (rgb.r * 256 + rgb.g) + rgb.b;

  //const legend: any = document.querySelector('div.legend.geometry');
  //const legendContent = legend.querySelector('.contet');
  if (currentState.firstDraw) {
    currentState.prevZoom = zoom;

    pipe(
      currentState.markers,
      fp.filter(marker => !!currentState?.resources?.[marker.iconTag]?.texture),
      fp.forEach((marker: LeafletMapMarker) => {
        const color = pipe(
          marker.icon,
          O.map(icon => icon.color),
          O.chain(c => O.fromNullable(d3Color(c))),
          O.map(x => x.rgb()),
          O.map(convertRgbToNumber),
          O.getOrElse(() => 0)
        );
        const pp = new PIXI.Graphics();
        pp.beginFill(0xffffff)
          .lineStyle(16, color)
          .drawCircle(0, 0, 110)
          .endFill();

        const shadow = new DropShadowFilter();
        shadow.blur = 4;
        shadow.alpha = 0.5;
        shadow.distance = 5;

        const p = pp as any;
        const coords = project([marker.lat, marker.lon]);
        const markerSprite = new MarkerSprite(
          currentState?.resources?.[marker.iconTag]?.texture
        );
        p.addChild(markerSprite);
        p.x0 = coords.x;
        p.y0 = coords.y;
        markerSprite.anchor.set(0.5, 0.5);
        markerSprite.width = 170;
        markerSprite.height = 170;
        p.scale.set(globalScale);
        //pp.filters = [shadow];
        container.addChild(p);
        currentState?.markerSprites?.push(p);
        p.legend = marker.title;
      })
    );

    const quadTrees = {};
    for (let z = map.getMinZoom(); z <= map.getMaxZoom(); z++) {
      const rInit = (z <= 7 ? 16 : 24) / utils.getScale(z);
      quadTrees[z] = solveCollision(currentState.markerSprites, {
        r0: rInit,
        zoom: z,
      });
    }
    /* const findMarker = ll => {
            const layerPoint = project(ll);
            const quadTree = quadTrees[utils.getMap().getZoom()];
            let marker;
            const rMax = quadTree.rMax;
            let found = false;
            quadTree.visit((quad, x1, y1, x2, y2) => {
              if (!quad.length) {
                const dx = quad.data.x - layerPoint.x;
                const dy = quad.data.y - layerPoint.y;
                const r = quad.data.scale.x * 16;
                if (dx * dx + dy * dy <= r * r) {
                  marker = quad.data;
                  found = true;
                }
              }
              return (
                found ||
                x1 > layerPoint.x + rMax ||
                x2 + rMax < layerPoint.x ||
                y1 > layerPoint.y + rMax ||
                y2 + rMax < layerPoint.y
              );
            });
            return marker;
          };
          */
    map.on('click', () => {
      let redraw = false;
      if (currentState.focus) {
        //(currentState.focus as any).texture = textures[currentState.focus.textureIndex];
        currentState.focus = null;
        //L.DomUtil.addClass(legend, 'hide');
        //legendContent.innerHTML = '';
        redraw = true;
      }
      //const marker = findMarker(e.latlng);
      /*if (marker) {
                marker.texture = currentState.focusTextures[marker.textureIndex];
                currentState.focus = marker;
                //legendContent.innerHTML = marker.legend;
                //L.DomUtil.removeClass(legend, 'hide');
                redraw = true;
              }*/
      if (redraw) utils.getRenderer().render(container);
    });
    map.on(
      'mousemove',
      L.Util.throttle(
        () => {
          /*const marker = findMarker(e.latlng);
                  if (marker) {
                    L.DomUtil.addClass(
                      self._container,
                      'leaflet-interactive'
                    );
                  } else {
                    L.DomUtil.removeClass(
                      self._container,
                      'leaflet-interactive'
                    );
                  }*/
        },
        32,
        undefined
      )
    );
  }
  if (currentState.firstDraw || currentState.prevZoom !== zoom) {
    currentState?.markerSprites?.forEach(markerSprite => {
      const position = markerSprite.cache[zoom];
      if (currentState.firstDraw) {

        markerSprite.x = position.x as number;
        markerSprite.y = position.y as number;
        markerSprite.scale.set(
          globalScale * (position.r as number * scale < 16 ? position.r as number / 16 : invScale)

        );
      } else {
        markerSprite.currentX = markerSprite.x;
        markerSprite.currentY = markerSprite.y;
        markerSprite.targetX = position.x;
        markerSprite.targetY = position.y;
        markerSprite.currentScale = markerSprite.scale.x;
        markerSprite.targetScale =
          globalScale * (position.r as number * scale < 16 ? position.r as number / 16 : invScale);
      }
    });
  }

  let start: any = null;
  const delta = 250;
  const animate = timestamp => {
    if (start === null) start = timestamp;
    const progress = timestamp - start;
    let lambda = progress / delta;
    if (lambda > 1) lambda = 1;
    lambda = lambda * (0.4 + lambda * (2.2 + lambda * -1.6));
    currentState?.markerSprites?.forEach(markerSprite => {
      markerSprite.x =
        markerSprite?.currentX ?? 0 +
        lambda * (markerSprite?.targetX ?? 0 - (markerSprite?.currentX ?? 0));
      markerSprite.y =
        markerSprite?.currentY ?? 0 +
        lambda * (markerSprite?.targetY ?? 0 - (markerSprite.currentY ?? 0));
      markerSprite.scale.set(
        markerSprite.currentScale ?? 0 +
        lambda * (markerSprite.targetScale ?? 0 - (markerSprite.currentScale ?? 0))
      );
    });
    renderer.render(container);
    if (progress < delta) {
      currentState.frame = requestAnimationFrame(animate);
    }
  };
  if (!currentState.firstDraw && currentState.prevZoom !== zoom) {
    currentState.frame = requestAnimationFrame(animate);
  }
  currentState.firstDraw = false;
  currentState.prevZoom = zoom;
  renderer.render(container);
};

export type PixiOverlayDef = { layer: Layer; container: Container };
const container = new Container();

export const createPixiOverlay = (): PixiOverlayDef => ({
  container,
  layer: (L as any).pixiOverlay(redraw, container, {
    doubleBuffering: doubleBuffering,
    destroyInteractionManager: true,
  }),
});

export const setState = (data: LayerData): void => {
  while (container.children[0]) {
    container.removeChild(container.children[0]);
  }
  currentState = {
    ...fp.cloneDeep(initialState),
    ...data,
  };
};
