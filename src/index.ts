import factoryInjectable from './factories';

export { Factory, Injectable, Scope, Singleton } from './decorators';
export { createInject, createInjectable } from './factories';
export { locator, WorkSpace } from './stores';
export { InjectableToken, LocatorConfig } from './types';

export default factoryInjectable;
