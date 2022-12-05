import { createInjectable } from '../factory';
import { InjectableType } from '../types/injectable.type';

export function Injectable(): Function;
export function Injectable(type?: InjectableType): ClassDecorator {
  return (target) => {
    console.log("Injectable:", target);
    createInjectable(type?.key || target.name, target, type?.scopeKey);
  };
}
