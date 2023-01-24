import { InjectConfig, InjectableRef, InjectLocatorRef } from '../types';

class InjectLocatorStore {
  private injects: Map<string, InjectableRef> = new Map();

  public set(injects: InjectLocatorRef[]): void {
    injects.forEach(({ name, use }) => {
      this.injects.set(name, use);
    });
  }

  public get(key: string): InjectableRef | undefined {
    return this.injects.get(key);
  }

  public add(inject: string | InjectLocatorRef, ref?: InjectableRef): void {
    if (typeof inject !== 'string') {
      const { name, use } = inject as InjectLocatorRef;

      this.injects.set(name, use);
    } else if (ref) {
      this.injects.set(inject, ref);
    }
  }
}

export const InjectLocator = new InjectLocatorStore();

export class InjectStore {
  private collection: Map<InjectableRef, InjectConfig[]> = new Map();

  public add(config: InjectConfig): void {
    const { parent, index } = config;

    const injects = this.get(parent);

    injects[index] = config;
  }

  public get(parentRef: InjectableRef): InjectConfig[] {
    const currentInjects = this.collection.get(parentRef);

    if (currentInjects) {
      return currentInjects;
    }

    const injects: InjectConfig[] = [];

    this.collection.set(parentRef, injects);

    return injects;
  }
}
