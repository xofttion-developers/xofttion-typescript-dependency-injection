import { InjectableRef } from './injectable.type';

type InjectConfigKey = 'class' | 'scope';

export type InjectConfig = {
  target: InjectableRef | string;
  key: InjectConfigKey;
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
