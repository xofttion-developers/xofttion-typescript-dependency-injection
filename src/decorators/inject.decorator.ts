import { createInject } from '../factory';
import { InjectableRef } from '../types';

export function InjectRef(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      index,
      parent: parent as Function,
      singleton: true
    });
  };
}

export function InjectVar(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      index,
      parent: parent as Function,
      singleton: false
    });
  };
}
