import { Constructable } from './constructable.type';

export type InjectableConfig = {
  target: InjectableRef;
  singleton: boolean;
};

export type InjectableRef<T = unknown> =
  | Function
  | Constructable<T>
  | CallableFunction;
