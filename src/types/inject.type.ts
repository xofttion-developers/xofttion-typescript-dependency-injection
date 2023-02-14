import { InjectableRef } from './injectable.type';

export type InjectConfig = {
  target: InjectableRef | string;
  index: number;
  parent: InjectableRef;
  container: boolean;
  singleton: boolean;
};

export type InjectLocatorRef = {
  name: string;
  useClass: InjectableRef;
};

export type InjectRef<T = unknown> = InjectableRef<T> | string;
