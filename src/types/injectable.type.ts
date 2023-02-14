import { Constructable } from './constructable.type';
import { ScopeType } from './scope.type';

export type InjectableConfig = {
  target: InjectableRef;
  singleton: boolean;
};

export type InjectionConfig<T> = {
  ref: InjectableRef<T>;
  scope?: ScopeType;
};

export type InjectableRef<T = unknown> =
  | Function
  | Constructable<T>
  | CallableFunction;
