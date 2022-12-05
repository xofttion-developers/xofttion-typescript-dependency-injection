import { createDependency } from '../factory';
import { DependencyRef } from '../types/dependency.type';

export function Dependency(target: DependencyRef): Function;
export function Dependency(
  target: DependencyRef,
  scopeKey?: string
): ParameterDecorator {
  return (parent, _key, index) => {
    createDependency(
      {
        dependency: target,
        index,
        parent: parent as Function
      },
      scopeKey
    );
  };
}
