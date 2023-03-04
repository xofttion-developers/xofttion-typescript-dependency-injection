import { createInject } from '../factories';
import { DependencyToken } from '../types';

export function Singleton(target: DependencyToken): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      target,
      index,
      parent,
      singleton: true,
      factory: false
    });
  };
}

export function Factory(target: DependencyToken): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      target,
      index,
      parent,
      singleton: false,
      factory: false
    });
  };
}

export function Scope(target: DependencyToken): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      target,
      index,
      parent,
      singleton: false,
      factory: true
    });
  };
}
