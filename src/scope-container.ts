import { InjectLocator, InjectableStore, InjectStore, ObjectStore } from './stores';
import {
  Constructable,
  ContextType,
  InjectableConfig,
  InjectableRef,
  InjectConfig,
  InjectionConfig,
  InjectRef,
  OnContext
} from './types';
import 'reflect-metadata';

const metaKey = 'design:paramtypes';

class ScopeContainer {
  private references = new InjectableStore();

  private injects = new InjectStore();

  private objects = new ObjectStore();

  public addInjectable(config: InjectableConfig): void {
    this.references.add(config);
  }

  public addInject(config: InjectConfig): void {
    this.injects.add(config);
  }

  public createInjectable<T = unknown>(config: InjectionConfig<T>): T {
    const { ref, context } = config;
    const refConfig = this.references.get(ref);

    if (!refConfig) {
      throw Error(`Class ${ref.name} is not found in the Injectables`);
    }

    const { singleton, target } = refConfig;

    return singleton
      ? this.getSingleton<T>(target)
      : this.createObject<T>(target, context);
  }

  private createObject<T = unknown>(
    ref: InjectableRef<T>,
    context?: ContextType
  ): T {
    const ConstructorObject = ref as unknown as Constructable<T>;

    const configs = this.injects.get(ref);

    const paramsRef: unknown[] = Reflect.getMetadata(metaKey, ConstructorObject);

    const params = paramsRef?.map((paramRef, index) => {
      const config: InjectConfig = configs[index];

      if (!config) {
        return this.createObject(paramRef as InjectableRef, context);
      }

      const { singleton, target } = config;

      const injectRef = this.getInjectableRef(target);

      if (!injectRef) {
        return this.createObject(paramRef as InjectableRef, context);
      }

      return singleton
        ? this.getSingleton(injectRef)
        : this.createObject(injectRef, context);
    });

    const object = new ConstructorObject(...(params || []));

    if (context && isContext(object)) {
      object.setContext(context);
    }

    return object;
  }

  private getSingleton<T = unknown>(ref: InjectableRef<T>): T {
    const object = this.objects.get<T>(ref);

    if (object) {
      return object;
    }

    const newObject = this.createObject(ref);

    this.objects.add(ref, newObject);

    return newObject;
  }

  private getInjectableRef(ref: InjectRef): InjectableRef | undefined {
    return typeof ref === 'string' ? InjectLocator.get(ref) : (ref as InjectableRef);
  }
}

function isContext(object: any): object is OnContext {
  return 'setContext' in object;
}

const scope = new ScopeContainer();

export default scope;
