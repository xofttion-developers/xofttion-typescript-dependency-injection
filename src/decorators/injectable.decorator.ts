import { createInjectable } from '../factory';

export function Singleton(): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: true });
  };
}

export function Factory(): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: false });
  };
}
