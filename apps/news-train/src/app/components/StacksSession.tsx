import React, { createContext, FunctionComponent, ReactNode } from 'react';
import useSWR from 'swr';
import { AppConfig, UserSession } from '@stacks/connect';

export const StacksSessionContext = createContext({});

type Props = {children: ReactNode}

const BlockstackSession: FunctionComponent<Props> = ({children}: Props) => {
    const fetcher = () => {
      const appConfig = new AppConfig(['store_write', 'publish_data']);
      const userSession: UserSession = new UserSession();
      return new Promise(resolve => {
        [appConfig]
          .filter(appConfig => !!appConfig)
          .map(() => {
            return resolve(userSession);
          });
      });
    };

  const { data } = useSWR('blockstackSession', fetcher, {
    suspense: true,
    shouldRetryOnError: false,
    revalidateOnFocus: false
  });

  const blockstackSession: UserSession = structuredClone(data);

  return (
    <StacksSessionContext.Provider value={blockstackSession}>
      {children}
    </StacksSessionContext.Provider>
  );
};

export default BlockstackSession;
