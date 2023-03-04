import { InjectableToken } from './injectable.type';

export type DependencyToken = InjectableToken | string | symbol;

export type DependencyConfig = {
  target?: DependencyToken;
  index: number;
  parent: InjectableToken;
  factory: boolean;
  singleton: boolean;
};

export type DependencyLocatorConfig = {
  token: DependencyToken;
  useClass: InjectableToken;
  useValue?: any;
};

export type DependencyKey<T = unknown> = InjectableToken<T> | string | symbol;
