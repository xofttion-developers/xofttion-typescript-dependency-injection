import { createInject } from '../factory';
import { InjectableRef } from '../types';

export function InjectRef(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      index,
      parent: parent as Function,
      singleton: true,
      container: false
    });
  };
}

export function InjectVar(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      index,
      parent: parent as Function,
      singleton: false,
      container: false
    });
  };
}

export function InjectScp(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      index,
      parent: parent as Function,
      singleton: false,
      container: true
    });
  };
}
