import { createDependency } from '../factory';
import { InjectableRef } from '../types';

export function Dependency(target: InjectableRef): Function;
export function Dependency(
  target: InjectableRef,
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
