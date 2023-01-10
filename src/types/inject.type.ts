import { InjectableRef } from './injectable.type';

export type InjectConfig = {
  target: InjectableRef | string;
  index: number;
  parent: InjectableRef;
};

export type InjectType<T = unknown> = InjectableRef<T> | string;
