import { InjectConfig, InjectableConfig, InjectionConfig } from '../types';
import { Container } from './container';

const rootContainer = new Container();

export function storeInjectable(ref: InjectableConfig, container?: Container): void {
  container ? container.storeInjectable(ref) : rootContainer.storeInjectable(ref);
}

export function storeInject(ref: InjectConfig, container?: Container): void {
  container ? container.storeInject(ref) : rootContainer.storeInject(ref);
}

function factoryInject<T = unknown>(
  config: InjectionConfig<T>,
  container?: Container
): T {
  return container
    ? container.createInjectable(config)
    : rootContainer.createInjectable(config);
}

export { Container } from './container';

export default factoryInject;
