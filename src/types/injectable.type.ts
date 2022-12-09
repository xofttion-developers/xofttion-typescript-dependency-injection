import { Constructable } from './constructable.type';

export type InjectableRef<T = unknown> =
  | Function
  | Constructable<T>
  | CallableFunction;
