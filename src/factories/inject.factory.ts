import { InjectableRef, InjectLocatorRef, ProvideKey } from '../types';

export function ProvideClass(
  provide: ProvideKey,
  useClass: InjectableRef
): InjectLocatorRef {
  return { provide, useClass };
}
