import { InjectableRef } from './injectable.type';

export type DependencyConfig = {
  dependency: InjectableRef;
  index: number;
  parent: InjectableRef;
};
