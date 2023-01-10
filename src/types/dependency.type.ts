import { InjectableRef } from './injectable.type';

export type DependencyJson = {
  name: string;
  use: InjectableRef;
};

export type DependencyConfig = {
  target: InjectableRef | string;
  functionKey: string | symbol;
};
