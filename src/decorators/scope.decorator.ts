import { createInject } from '../factory';

export function Scope(): ParameterDecorator {
  return (parent, _key, index) => {
    createInject({
      target: 'Scope',
      key: 'scope',
      index,
      parent: parent as Function,
      singleton: false,
      container: false
    });
  };
}
