import { DependencyConfig, InjectableToken } from '../types';

export class DependencyStore {
  private collection: Map<InjectableToken, DependencyConfig[]> = new Map();

  public add(config: DependencyConfig): void {
    const { parent, index } = config;

    const dependencies = this.get(parent);

    dependencies[index] = config;
  }

  public get(token: InjectableToken): DependencyConfig[] {
    const current = this.collection.get(token);

    if (current) {
      return current;
    }

    const dependencies: DependencyConfig[] = [];

    this.collection.set(token, dependencies);

    return dependencies;
  }
}
