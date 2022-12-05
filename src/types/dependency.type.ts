import { Constructable } from './constructable.type';

export type DependencyRef<T = unknown> =
  | Function
  | Constructable<T>
  | CallableFunction;

export type DependencyConfig = {
  dependency: DependencyRef;
  index: number;
  parent: DependencyRef;
};
