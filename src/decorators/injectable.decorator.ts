import { storeInjectable } from '../factories';

type InjectableConfig = {
  singleton: boolean;
};

export function Injectable({ singleton }: InjectableConfig): ClassDecorator {
  return (target) => {
    storeInjectable({ target, singleton });
  };
}
