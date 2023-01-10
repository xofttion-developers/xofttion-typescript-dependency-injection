import { InjectableRef } from './injectable.type';

export type InjectConfig = {
  target: InjectableRef | string;
  index: number;
  parent: InjectableRef;
  singleton: boolean;
};

export type InjectLocatorRef = {
  name: string;
  use: InjectableRef;
};

export type InjectRef<T = unknown> = InjectableRef<T> | string;
