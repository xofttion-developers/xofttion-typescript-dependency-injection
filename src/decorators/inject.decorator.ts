import { createInject } from '../factory';
import { InjectableRef } from '../types';

export function Inject(target: InjectableRef | string): Function;
export function Inject(
  target: InjectableRef | string,
  scopeKey?: string
): ParameterDecorator {
  return (parent, _key, index) => {
    createInject(
      {
        target,
        index,
        parent: parent as Function
      },
      scopeKey
    );
  };
}
