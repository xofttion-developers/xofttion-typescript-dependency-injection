import { ScopeContext } from './scope-context';
import { InjectConfig, InjectableRef, DependencyConfig } from './types';

const contexts = new Map<string, ScopeContext>();

const SCOPE_CONTEXT_ROOT = 'root';

export function createInjectable(
  injectable: InjectableRef,
  scopeKey?: string
): void {
  getScopeContext(scopeKey).addInjectable(injectable);
}

export function createInject(inject: InjectConfig, scopeKey?: string): void {
  getScopeContext(scopeKey).addInject(inject);
}

export function createDependency(
  injectable: InjectableRef,
  dependency: DependencyConfig,
  scopeKey?: string
): void {
  getScopeContext(scopeKey).addDependency(injectable, dependency);
}

export function InjectableFactory<T = unknown>(
  ref: InjectableRef<T>,
  scopeKey?: string
): T {
  return getScopeContext(scopeKey).createInjectable(ref);
}

function getScopeContext(scopeKey?: string): ScopeContext {
  const scopeFinal = scopeKey || SCOPE_CONTEXT_ROOT;

  const contextCurrent = contexts.get(scopeFinal);

  if (contextCurrent) {
    return contextCurrent;
  }

  const context = new ScopeContext();

  contexts.set(scopeFinal, context);

  return context;
}
