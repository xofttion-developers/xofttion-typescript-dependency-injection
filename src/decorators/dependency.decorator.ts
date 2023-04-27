import { storeInject } from '../factories';
import { InjectToken } from '../types';

export function Singleton(target: InjectToken): ParameterDecorator {
  return (parent, _, index) => {
    storeInject({
      target,
      index,
      parent,
      scopeable: false,
      singleton: true
    });
  };
}

export function Factory(target: InjectToken): ParameterDecorator {
  return (parent, _, index) => {
    storeInject({
      target,
      index,
      parent,
      scopeable: false,
      singleton: false
    });
  };
}

export function Scope(target: InjectToken): ParameterDecorator {
  return (parent, _, index) => {
    storeInject({
      target,
      index,
      parent,
      scopeable: true,
      singleton: false
    });
  };
}
