import { createDependency } from '../factory';
import { InjectableRef } from '../types';

export function Dependency(target: InjectableRef | string): Function;
export function Dependency(
  target: InjectableRef | string,
  scopeKey?: string
): MethodDecorator {
  return (parent, name) => {
    createDependency(
      parent.constructor,
      {
        target,
        functionKey: name
      },
      scopeKey
    );
  };
}
