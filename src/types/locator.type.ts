import { InjectToken } from './dependency.type';
import { InjectableToken } from './injectable.type';

export type LocatorConfig = {
  token: InjectToken;
  useClass: InjectableToken;
  useValue?: any;
};
