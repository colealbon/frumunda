import useSWR from 'swr';

import { AppConfig, UserSession } from '@stacks/connect';
import { Storage, StorageOptions } from '@stacks/storage';

// import { useEffect, useState, useCallback} from 'react';
// import useSWR, { useSWRConfig }  from 'swr';
// import localforage from 'localforage'

export function useStacks () {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    const userSession: UserSession = new UserSession();
    const storageOptions: StorageOptions = { userSession };
    const storage = new Storage(storageOptions); // eslint-disable-line @typescript-eslint/no-unused-vars

    const fetcher = () => {
    return new Promise(resolve => {
        [appConfig]
        .filter(appConfig => !!appConfig)
        .map(() => {
          console.log(userSession)
          return resolve(userSession);
        });
    });
    };

  const { data } = useSWR(
    'stacks',
    fetcher , 
    {
      suspense: true

      // fallbackData: fallback
    }
  )

  console.log(data)

  // const blockstackSession: UserSession = structuredClone(
  //   data as Record<string, unknown>
  // );

  // const blockstackStorage = new Storage(storageOptions);

  return {
    stacksSession: userSession,
    stacksStorage: storage
    // setCategories: setCategories
  }
}