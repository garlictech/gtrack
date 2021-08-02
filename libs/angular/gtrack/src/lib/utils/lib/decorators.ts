// Info: https://itnext.io/custom-decorators-in-angular-c54da873b3b3
import { SimpleChanges } from '@angular/core';

/**
 @Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnChanges {
    @Input() value1: string;
    @Input() value2: string;
    @TrackChanges<string>('value1', 'makeChangesVal1')
    @TrackChanges<string>('value2', 'makeChangesVal2', ChangesStrategy.First)
    ngOnChanges(changes: SimpleChanges): void {}
}
 */

const enum ChangesStrategy {
  First = 'firstTime',
  Each = 'eachTime',
  NonFirst = 'nonFirst',
}

export function TrackChanges<Type>(
  key: string,
  methodName: string,
  strategy: ChangesStrategy = ChangesStrategy.Each
): any {
  return function (
    targetClass: { [x: string]: { call: (arg0: any, arg1: Type) => void } },
    _functionName: string,
    descriptor: any
  ): any {
    const source = descriptor.value;

    descriptor.value = function (changes: SimpleChanges): any {
      if (changes && changes[key] && changes[key].currentValue !== undefined) {
        const isFirstChange = changes[key].firstChange;

        if (
          strategy === ChangesStrategy.Each ||
          (strategy === ChangesStrategy.First && isFirstChange) ||
          (strategy === ChangesStrategy.NonFirst && !isFirstChange)
        ) {
          targetClass[methodName].call(this, changes[key].currentValue as Type);
        }
      }

      return source.call(this, changes);
    };

    return descriptor;
  };
}

/**
 @Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent {
    constructor(private ngZone: NgZone) {
        this.drawChart();
    }
    @OutsideZone
    highlightBlock(top = 100): void {
        window.scrollTo({
            behavior: 'smooth',
            top
        });
    }
    @OutsideZone
    drawChart(): void {
        // drawing logic
    }
}
 */
/* export function OutsideZone(descriptor: {
  value: (...data: any[]) => any;
}): any {
  const source = descriptor.value;
  descriptor.value = function (...data: any): any {
    if (!this.ngZone) {
      throw new Error(
        "Class with 'OutsideZone' decorator should have 'ngZone' class property with 'NgZone' class."
      );
    }
    return this.ngZone.runOutsideAngular(() => source.call(this, ...data));
  };
  return descriptor;
}
 */
const isNull = (item: unknown) => item === null || item === undefined;

// service commented out for demonstration purposes
export function Storage<Type>(
  key: string,
  defaultValue: Type 
): any {
  return (target: any, propName: string) => {
    let _val: Type = target[propName];

    Object.defineProperty(target, propName, {
      get(): Type | unknown {
        if (!isNull(_val)) {
          return _val;
        }

        // let item = StorageService.getItem(key);
        let item = JSON.parse(localStorage.getItem(key) as string) ;
        if (isNull(item)) {
          item = defaultValue;
          _val = defaultValue;
          // StorageService.setItem(key, item, storageType === StorageType.Local);
          localStorage.setItem(key, JSON.stringify(item));
        }

        return item;
      },
      set(item: Type): void {
        _val = item;
        // StorageService.setItem(key, item, storageType === StorageType.Local);
        localStorage.setItem(key, JSON.stringify(item));
      },
    });
  };
}

/**
 @Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent {
    @Safe()
    getData(): Record<string, unknown> { ... }
    @Safe({ returnValue: [] })
    getData(): string[] { ... }
}

 */
export function Safe(params: any = {}): any {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    const originalMethod = descriptor.value;

    descriptor.value = function SafeWrapper(...args: any[]): any | false {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        return params.returnValue !== undefined ? params.returnValue : false;
      }
    };

    return descriptor;
  };
}
