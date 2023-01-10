import { createInjectable } from '../factory';

export function InjectableSingleton(): Function;
export function InjectableSingleton(scopeKey?: string): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: true }, scopeKey);
  };
}

export function InjectableFactory(): Function;
export function InjectableFactory(scopeKey?: string): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: false }, scopeKey);
  };
}
