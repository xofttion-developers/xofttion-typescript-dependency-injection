import { createInjectable } from '../factories';

type InjectableConfig = {
  singleton: boolean;
};

export function Injectable({ singleton }: InjectableConfig): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton });
  };
}
