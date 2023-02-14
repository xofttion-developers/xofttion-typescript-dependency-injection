import RootContainer from './container';
import { InjectableConfig, InjectConfig, InjectionConfig } from './types';

export function createInjectable(ref: InjectableConfig): void {
  RootContainer.pushInjectable(ref);
}

export function createInject(ref: InjectConfig): void {
  RootContainer.pushInject(ref);
}

export function InjectionFactory<T = unknown>(config: InjectionConfig<T>): T {
  return RootContainer.createInjectable(config);
}
