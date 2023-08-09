import { Context } from '../stores';
import { Constructable } from './constructable.type';

export type InjectableToken<T = unknown> =
  | Object
  | Function
  | CallableFunction
  | Constructable<T>;

export type InjectableConfig = {
  scopeable: boolean;
  singleton: boolean;
  target: InjectableToken;
};

export type InjectionConfig<T> = {
  token: InjectableToken<T>;
  context?: Context;
};
