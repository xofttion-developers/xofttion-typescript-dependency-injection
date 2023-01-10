import { InjectableRef } from './injectable.type';

export type DependencyJson = { [key: string]: InjectableRef };

export type DependencyConfig = {
  target: InjectableRef | string;
  functionKey: string | symbol;
};
