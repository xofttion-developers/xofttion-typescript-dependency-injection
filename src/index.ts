import { InjectionFactory } from './factory';

export { Factory, Inject, Injectable, Scope, Singleton } from './decorators';
export { ProvideClass } from './factories';
export { createInject, createInjectable } from './factory';
export { InjectLocator } from './stores';
export { InjectLocatorRef, ScopeStore } from './types';

export default InjectionFactory;
