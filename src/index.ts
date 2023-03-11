import { warehouse } from './factories';

export { Factory, Injectable, Scope, Singleton, Workspace } from './decorators';
export { createInject, createInjectable } from './factories';
export { locator, WorkspaceStore } from './stores';
export { LocatorConfig } from './types';

export default warehouse;
