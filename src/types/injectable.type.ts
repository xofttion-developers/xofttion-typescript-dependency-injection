import { Constructable } from './constructable.type';
import { ContextType } from './context.type';

export type InjectableConfig = {
  target: InjectableRef;
  singleton: boolean;
};

export type InjectionConfig<T> = {
  ref: InjectableRef<T>;
  context?: ContextType;
};

export type InjectableRef<T = unknown> =
  | Function
  | Constructable<T>
  | CallableFunction;
