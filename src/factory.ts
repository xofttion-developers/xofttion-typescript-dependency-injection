import { InjectionContainer } from './container';
import { InjectableConfig, InjectConfig, InjectionConfig } from './types';

const root = new InjectionContainer();

export function createInjectable(ref: InjectableConfig): void {
  root.pushInjectable(ref);
}

export function createInject(ref: InjectConfig): void {
  root.pushInject(ref);
}

export function InjectionFactory<T = unknown>(config: InjectionConfig<T>): T {
  return root.createInjectable(config);
}
