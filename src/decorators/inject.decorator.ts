import { registerInject } from '../factories';
import { InjectToken } from '../types';

interface Inject {
  token: InjectToken;
  scopeable: boolean;
  singleton: boolean;
}

function createInject({ scopeable, singleton, token }: Inject): ParameterDecorator {
  return (parent, _, index) => {
    registerInject({
      config: { index, parent, scopeable, singleton, token }
    });
  };
}

export function Singleton(token: InjectToken): ParameterDecorator {
  return createInject({ token, scopeable: false, singleton: true });
}

export function Scope(token: InjectToken): ParameterDecorator {
  return createInject({ token, scopeable: true, singleton: false });
}

export function Factory(token: InjectToken): ParameterDecorator {
  return createInject({ token, scopeable: false, singleton: false });
}
