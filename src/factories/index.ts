import {
  InjectConfig,
  InjectableConfig,
  InjectableToken,
  InjectionConfig
} from '../types';
import { Container } from './container';

interface Injection<T> {
  config: InjectionConfig<T>;
  container?: Container;
}

interface Token<T> {
  token: InjectableToken<T>;
  container?: Container;
}

interface Injectable {
  config: InjectableConfig;
  container?: Container;
}

interface Inject {
  config: InjectConfig;
  container?: Container;
}

const rootContainer = new Container();

function factoryInject<T = unknown>({ config, container }: Injection<T>): T {
  return (container || rootContainer).createInjectable(config);
}

export function inject<T = unknown>({ token, container }: Token<T>): T {
  return factoryInject({ config: { token }, container });
}

export function registerInjectable({ config, container }: Injectable): void {
  (container || rootContainer).registerInjectable(config);
}

export function registerInject({ config, container }: Inject): void {
  (container || rootContainer).registerInject(config);
}

export function printInjectables(): void {
  rootContainer.printInjectables();
}

export function printInjects(): void {
  rootContainer.printInjects();
}

export { Container } from './container';

export default factoryInject;
