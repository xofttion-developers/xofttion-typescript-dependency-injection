import { Constructable } from './constructable.type';
import { ScopeStore } from './scope.type';

export type InjectableConfig = {
  target: InjectableRef;
  singleton: boolean;
};

export type InjectionConfig<T> = {
  ref: InjectableRef<T>;
  scope?: ScopeStore;
};

export type InjectableRef<T = unknown> =
  | Function
  | Constructable<T>
  | CallableFunction;
