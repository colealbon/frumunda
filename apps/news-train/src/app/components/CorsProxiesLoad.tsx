import React, { FunctionComponent, ReactNode} from 'react';
import { useCorsProxies } from '../react-hooks/useCorsProxies';

export const CorsProxiesContext = React.createContext({});
type Props = {children: ReactNode}
const CorsProxiesLoad: FunctionComponent<Props> = ({children}: Props) => {
  const { corsProxies } = useCorsProxies();
  const corsProxiesClone: Record<string, unknown> = structuredClone(corsProxies);
  return (
    <CorsProxiesContext.Provider value={corsProxiesClone}>
      {children}
    </CorsProxiesContext.Provider>
  );
};

export default CorsProxiesLoad;
