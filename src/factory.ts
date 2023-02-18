import rootContainer from './container';
import { InjectableConfig, InjectConfig, InjectionConfig } from './types';

export function createInjectable(ref: InjectableConfig): void {
  rootContainer.pushInjectable(ref);
}

export function createInject(ref: InjectConfig): void {
  rootContainer.pushInject(ref);
}

export function InjectionFactory<T = unknown>(config: InjectionConfig<T>): T {
  return rootContainer.createInjectable(config);
}
