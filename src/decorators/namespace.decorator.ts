import { createInject } from '../factories';

export function Namespace(): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      parent,
      index,
      singleton: false,
      factory: false
    });
  };
}
