import { InjectionFactory } from './factory';

export {
  InjectFactory,
  InjectSingleton,
  InjectableFactory,
  InjectableSingleton
} from './decorators';
export { createInject, createInjectable } from './factory';
export { InjectLocator } from './stores';
export { InjectLocatorRef } from './types';

export default InjectionFactory;
