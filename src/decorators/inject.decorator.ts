import { createInject } from '../factory';
import { InjectableRef } from '../types';

export function Singleton(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      key: 'object',
      index,
      parent: parent as Function,
      singleton: true,
      factory: false
    });
  };
}

export function Factory(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      key: 'object',
      index,
      parent: parent as Function,
      singleton: false,
      factory: false
    });
  };
}

export function Inject(target: InjectableRef | string): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target,
      key: 'object',
      index,
      parent: parent as Function,
      singleton: false,
      factory: true
    });
  };
}
