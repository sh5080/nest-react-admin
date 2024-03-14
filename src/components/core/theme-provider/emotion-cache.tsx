import * as React from 'react';
import { useEffect, useState } from 'react';
import createCache from '@emotion/cache';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

interface Registry {
  cache: EmotionCache;
  inserted: { name: string; isGlobal: boolean }[];
}

export interface NextAppDirEmotionCacheProviderProps {
  options: Omit<OptionsOfCreateCache, 'insertionPoint'>;
  CacheProvider?: (props: { value: EmotionCache; children: React.ReactNode }) => React.ReactElement | null;
  children: React.ReactNode;
}

export default function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps): React.ReactElement {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  const [registry, setRegistry] = useState<Registry>({
    cache: createCache(options),
    inserted: [],
  });

  useEffect(() => {
    const prevInsert = registry.cache.insert;
    registry.cache.insert = (...args) => {
      const [selector, serialized] = args;

      if (registry.cache.inserted[serialized.name] === undefined) {
        setRegistry((prevState) => ({
          ...prevState,
          inserted: [...prevState.inserted, { name: serialized.name, isGlobal: !selector }],
        }));
      }

      return prevInsert(...args);
    };

    return () => {
      registry.cache.insert = prevInsert;
    };
  }, [registry.cache]);

  useEffect(() => {
    const inserted = registry.inserted;

    if (inserted.length === 0) {
      return;
    }

    let styles = '';
    let dataEmotionAttribute = registry.cache.key;

    const globals: { name: string; style: string }[] = [];

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style !== 'boolean') {
        if (isGlobal) {
          globals.push({ name, style });
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    const handleInsertion = () => {
      globals.forEach(({ name, style }) => {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = style;
        styleTag.setAttribute('data-emotion', `${registry.cache.key}-global ${name}`);
        document.head.appendChild(styleTag);
      });

      if (styles) {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = styles;
        styleTag.setAttribute('data-emotion', dataEmotionAttribute);
        document.head.appendChild(styleTag);
      }
    };

    handleInsertion();

    return () => {
      inserted.forEach(({ name }) => {
        const styleTag = document.querySelector(`style[data-emotion="${registry.cache.key}-global ${name}"]`);
        if (styleTag) {
          styleTag.remove();
        }
      });

      const styleTag = document.querySelector(`style[data-emotion="${dataEmotionAttribute}"]`);
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, [registry]);

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
