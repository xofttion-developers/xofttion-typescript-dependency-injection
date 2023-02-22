import { createInjectable } from '../factory';

type InjectableConfig = {
  singleton: boolean;
};

export function Injectable({ singleton }: InjectableConfig): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton });
  };
}
