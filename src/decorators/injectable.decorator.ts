import { createInjectable } from '../factory';

export function Singleton(): Function;
export function Singleton(scopeKey?: string): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: true }, scopeKey);
  };
}

export function Factory(): Function;
export function Factory(scopeKey?: string): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: false }, scopeKey);
  };
}
