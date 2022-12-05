import { Constructable } from './constructable.type';

export type DependencyType = {
  key?: string;
  scopeKey?: string;
  target?: Function;
};

export type DependencyRef<T = unknown> =
  | Constructable<T>
  | CallableFunction
  | string;
