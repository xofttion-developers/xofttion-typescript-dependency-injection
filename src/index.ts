import { InjectionFactory } from './factory';

export {
  InjectRef,
  InjectScp,
  InjectVar,
  Factory,
  Scope,
  Singleton
} from './decorators';
export { createInject, createInjectable } from './factory';
export { InjectLocator } from './stores';
export { InjectLocatorRef, ScopeStore } from './types';

export default InjectionFactory;
