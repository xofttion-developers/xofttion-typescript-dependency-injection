import { InjectableToken } from './injectable.type';

export type InjectToken = InjectableToken | string | symbol;

export type InjectConfig = {
  target: InjectToken;
  index: number;
  parent: InjectableToken;
  scopeable: boolean;
  singleton: boolean;
};

export type InjectKey<T = unknown> = InjectableToken<T> | string | symbol;
