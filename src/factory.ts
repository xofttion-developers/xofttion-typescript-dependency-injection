import { ScopeContext } from './scope-context';
import { DependencyConfig, InjectableRef } from './types';

const SCOPE_CONTEXTS = new Map<string, ScopeContext>();
const SCOPE_CONTEXT_ROOT = 'root';

export function createInjectable(
  injectable: InjectableRef,
  scopeKey?: string
): void {
  getScopeContext(scopeKey).addInjectable(injectable);
}

export function createDependency(
  dependency: DependencyConfig,
  scopeKey?: string
): void {
  getScopeContext(scopeKey).addDependency(dependency);
}

export function InjectableFactory<T = unknown>(
  ref: InjectableRef<T>,
  scopeKey?: string
): T {
  return getScopeContext(scopeKey).getInstance(ref);
}

function getScopeContext(scopeKey?: string): ScopeContext {
  const scopeFinal = scopeKey || SCOPE_CONTEXT_ROOT;

  const contextCurrent = SCOPE_CONTEXTS.get(scopeFinal);

  if (contextCurrent) {
    return contextCurrent;
  }

  const scopeContext = new ScopeContext();

  SCOPE_CONTEXTS.set(scopeFinal, scopeContext);

  return scopeContext;
}
