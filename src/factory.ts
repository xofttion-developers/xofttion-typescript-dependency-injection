import scope from './scope-container';
import { InjectableConfig, InjectConfig, InjectionConfig } from './types';

export function createInjectable(ref: InjectableConfig): void {
  scope.addInjectable(ref);
}

export function createInject(ref: InjectConfig): void {
  scope.addInject(ref);
}

export function InjectionFactory<T = unknown>(config: InjectionConfig<T>): T {
  return scope.createInjectable(config);
}
