import { createDependency } from '../factory';
import { DependencyType } from '../types/dependency.type';

export function Dependency(type: DependencyType): ParameterDecorator {
  return (parent, _key, index) => {
    console.log("Dependency:", type.target);
    createDependency(
      {
        dependencyKey: type.key || type.target?.name,
        index,
        parentKey: (parent as Function).name
      },
      type.scopeKey
    );
  };
}
