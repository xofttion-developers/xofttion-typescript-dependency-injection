import { DependencyConfig, InjectableConfig, InjectionConfig } from '../types';
import { WarehouseContainer } from './warehouse';

const root = new WarehouseContainer();

export function createInjectable(ref: InjectableConfig): void {
  root.pushInjectable(ref);
}

export function createInject(ref: DependencyConfig): void {
  root.pushDependency(ref);
}

export function warehouse<T = unknown>(config: InjectionConfig<T>): T {
  return root.createInjectable(config);
}
