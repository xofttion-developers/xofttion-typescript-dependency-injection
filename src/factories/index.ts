import {
  InjectConfig,
  InjectableConfig,
  InjectableToken,
  InjectionConfig
} from '../types';
import { Container } from './container';

const rootContainer = new Container();

function factoryInject<T = unknown>(
  config: InjectionConfig<T>,
  container?: Container
): T {
  return container
    ? container.createInjectable(config)
    : rootContainer.createInjectable(config);
}

export function inject<T = unknown>(
  token: InjectableToken<T>,
  container?: Container
): T {
  return factoryInject({ token }, container);
}

export function storeInjectable(ref: InjectableConfig, container?: Container): void {
  container ? container.storeInjectable(ref) : rootContainer.storeInjectable(ref);
}

export function storeInject(ref: InjectConfig, container?: Container): void {
  container ? container.storeInject(ref) : rootContainer.storeInject(ref);
}

export { Container } from './container';

export default factoryInject;
