import { ScopeContainer } from './scope-container';
import { InjectConfig, InjectableRef, InjectableConfig } from './types';

const containers = new Map<string, ScopeContainer>();

const SCOPE_CONTAINER_ROOT = 'root';

export function createInjectable(
  injectable: InjectableConfig,
  scopeKey?: string
): void {
  getContainer(scopeKey).addInjectable(injectable);
}

export function createInject(inject: InjectConfig, scopeKey?: string): void {
  getContainer(scopeKey).addInject(inject);
}

export function InjectionFactory<T = unknown>(
  injectable: InjectableRef<T>,
  scopeKey?: string
): T {
  return getContainer(scopeKey).createInjectable(injectable);
}

function getContainer(scopeKey?: string): ScopeContainer {
  const scope = scopeKey || SCOPE_CONTAINER_ROOT;

  const currentContainer = containers.get(scope);

  if (currentContainer) {
    return currentContainer;
  }

  const container = new ScopeContainer();

  containers.set(scope, container);

  return container;
}
