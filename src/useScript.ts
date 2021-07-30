import { useEffect, useState } from 'react';

interface ScriptProps {
  src: string,
};

type ScriptStatus =  'loading' | 'loaded' | 'error';

export const useScript = (props: HTMLScriptElement | ScriptProps): ScriptStatus => {
  const [scriptState, setScriptState] = useState<ScriptStatus>('loading');

  useEffect(() => {
    let script = document.querySelector(`script[src="${props.src}"]`) as
      | HTMLScriptElement
      | undefined;

      const setStateCallback = (event: Event) => {
        setScriptState(
          (event.type as keyof HTMLElementEventMap) === 'load'
            ? 'loaded'
            : 'error'
        );
      };

    if (!script) {
      script = document.createElement('script');
      Object.assign(script, props);

      script.addEventListener('load', setStateCallback);
      script.addEventListener('error', setStateCallback);

      document.body.appendChild(script);
    }

    return (): void => {
      if (script) {
        script.removeEventListener("load", setStateCallback);
        script.removeEventListener("error", setStateCallback);
        script.remove();
      }
    };
  }, [props]);

  return scriptState;
};
