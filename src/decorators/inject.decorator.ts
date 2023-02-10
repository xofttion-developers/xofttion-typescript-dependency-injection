import { createInject } from '../factory';
import { InjectableRef } from '../types';

export function InjectRef(target: InjectableRef | string): Function;
export function InjectRef(
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

export function InjectVar(target: InjectableRef | string): Function;
export function InjectVar(
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
