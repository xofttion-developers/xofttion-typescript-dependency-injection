import factoryInject from './factories';

export { Factory, Injectable, Scope, Singleton } from './decorators';
export { Container, inject, registerInject, registerInjectable } from './factories';
export { Context, fetchInLocator, pushInLocator, saveInLocator } from './stores';
export { InjectableToken, InjectToken, LocatorConfig } from './types';

export default factoryInject;
