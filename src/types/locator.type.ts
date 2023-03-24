import { DependencyToken } from './dependency.type';
import { InjectableToken } from './injectable.type';

export type LocatorConfig = {
  token: DependencyToken;
  useClass: InjectableToken;
  useValue?: any;
};
