import { InjectConfig, InjectableRef, InjectLocatorRef } from '../types';

class InjectLocatorStore {
  private injects: Map<string, InjectableRef> = new Map();

  public set(injects: InjectLocatorRef[]): void {
    injects.forEach(({ name, useClass }) => {
      this.injects.set(name, useClass);
    });
  }

  public get(key: string): InjectableRef | undefined {
    return this.injects.get(key);
  }

  public add(inject: string | InjectLocatorRef, ref?: InjectableRef): void {
    if (typeof inject !== 'string') {
      const { name, useClass } = inject;

      this.injects.set(name, useClass);
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
