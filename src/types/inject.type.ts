import { InjectableRef } from './injectable.type';

type InjectConfigKey = 'object' | 'scope';

export type InjectConfig = {
  target: InjectableRef | string;
  key: InjectConfigKey;
  index: number;
  parent: InjectableRef;
  factory: boolean;
  singleton: boolean;
};

export type ProvideKey = InjectableRef | string;

export type InjectLocatorRef = {
  provide: ProvideKey;
  useValue?: any;
  useClass: InjectableRef;
};

export type InjectRef<T = unknown> = InjectableRef<T> | string;
