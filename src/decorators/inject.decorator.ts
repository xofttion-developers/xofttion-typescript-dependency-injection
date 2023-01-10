import { createInject } from '../factory';
import { InjectableRef } from '../types';

export function InjectSingleton(target: InjectableRef | string): Function;
export function InjectSingleton(
  target: InjectableRef | string,
  scopeKey?: string
): ParameterDecorator {
  return (parent, _key, index) => {
    createInject(
      {
        target,
        index,
        parent: parent as Function,
        singleton: true
      },
      scopeKey
    );
  };
}

export function InjectFactory(target: InjectableRef | string): Function;
export function InjectFactory(
  target: InjectableRef | string,
  scopeKey?: string
): ParameterDecorator {
  return (parent, _key, index) => {
    createInject(
      {
        target,
        index,
        parent: parent as Function,
        singleton: false
      },
      scopeKey
    );
  };
}
