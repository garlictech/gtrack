import { createAnimation } from '@ionic/angular';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function pageTransition(_: HTMLElement, opts: any) {
  const DURATION = 400;

  const rootTransition = createAnimation()
    .duration(opts.duration || DURATION)
    .easing('cubic-bezier(0.3,0,0.66,1)');

  const enteringPage = createAnimation()
    .addElement(getIonPageElement(opts.enteringEl))
    .beforeRemoveClass('ion-page-invisible');

  const leavingPage = createAnimation().addElement(
    getIonPageElement(opts.leavingEl)
  );

  enteringPage.fromTo('opacity', '0', '0.5');
  leavingPage.fromTo('opacity', '0.5', '0');

  rootTransition.addAnimation(enteringPage);
  rootTransition.addAnimation(leavingPage);
  return rootTransition;
}

export const getIonPageElement = (element: HTMLElement): any => {
  if (element.classList.contains('ion-page')) {
    return element;
  }

  const ionPage = element.querySelector(
    ':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs'
  );
  if (ionPage) {
    return ionPage;
  }
  return element;
};
