import { createInject } from '../factories';

export function Workspace(): ParameterDecorator {
  return (parent, _, index) => {
    createInject({
      parent,
      index,
      singleton: false,
      factory: false
    });
  };
}
