import { InjectionFactory } from './factory';

export { InjectScp, InjectRef, InjectVar, Factory, Singleton } from './decorators';
export { createInject, createInjectable } from './factory';
export { InjectLocator } from './stores';
export { InjectLocatorRef, OnScope, Scope, ScopeType } from './types';

export default InjectionFactory;
