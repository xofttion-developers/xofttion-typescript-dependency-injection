import { createInject } from '../factories';
import { DependencyToken } from '../types';

export function Singleton(target: DependencyToken): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      target,
      index,
      parent,
      scopeable: false,
      singleton: true
    });
  };
}

export function Factory(target: DependencyToken): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      target,
      index,
      parent,
      scopeable: false,
      singleton: false
    });
  };
}

export function Scope(target: DependencyToken): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      target,
      index,
      parent,
      scopeable: true,
      singleton: false
    });
  };
}
