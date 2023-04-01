import { DependencyConfig, InjectableConfig, InjectionConfig } from '../types';
import { ContainerFactory } from './container';

const containerFactory = new ContainerFactory();

export function createInjectable(ref: InjectableConfig): void {
  containerFactory.pushInjectable(ref);
}

export function createInject(ref: DependencyConfig): void {
  containerFactory.pushDependency(ref);
}

function factoryInjectable<T = unknown>(config: InjectionConfig<T>): T {
  return containerFactory.createInjectable(config);
}

export default factoryInjectable;
