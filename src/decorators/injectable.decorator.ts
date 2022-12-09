import { createInjectable } from '../factory';

export function Injectable(): Function;
export function Injectable(scopeKey?: string): ClassDecorator {
  return (target) => {
    createInjectable(target, scopeKey);
  };
}
