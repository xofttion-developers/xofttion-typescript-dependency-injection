import factoryInject from './factories';

export { Factory, Injectable, Scope, Singleton } from './decorators';
export { Container, inject, storeInject, storeInjectable } from './factories';
export { locator, Context } from './stores';
export { InjectableToken, LocatorConfig } from './types';

export default factoryInject;
