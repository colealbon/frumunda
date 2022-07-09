import React, { FunctionComponent, ReactNode} from 'react';
import useSWR from 'swr';
import localforage from 'localforage'

export const CorsProxiesContext = React.createContext({});

type Props = {children: ReactNode}
const CorsProxies: FunctionComponent<Props> = ({children}: Props) => {

  const fetcher = () => {
    const defaultCorsProxies = {
      '/.netlify/functions/main?url=': { checked: true },
      'http://localhost:8888/.netlify/functions/main?url=': { checked: false }
    }
    return new Promise((resolve, reject) => {
      localforage.getItem('corsProxies')
      .then(value => resolve(value || defaultCorsProxies))
    })
  }

  const { data } = useSWR(
    'corsProxies',
    fetcher, 
    {
      suspense: true
    }
  )

  const corsProxies = structuredClone(data)

  // return (<pre>{JSON.stringify(corsProxies, null, 2)}</pre>)
  return (
    <CorsProxiesContext.Provider value={corsProxies}>
      {children}
    </CorsProxiesContext.Provider>
  );
};

export default CorsProxies;