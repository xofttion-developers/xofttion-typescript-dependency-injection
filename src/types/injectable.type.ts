import { WorkspaceStore } from '../stores';
import { Constructable } from './constructable.type';

export type InjectableToken<T = unknown> =
  | Object
  | Function
  | CallableFunction
  | Constructable<T>;

export type InjectableConfig = {
  singleton: boolean;
  target: InjectableToken;
};

export type InjectionConfig<T> = {
  token: InjectableToken<T>;
  workspace?: WorkspaceStore;
};
