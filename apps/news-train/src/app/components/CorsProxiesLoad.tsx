import React, { FunctionComponent, ReactNode} from 'react';
import { useCorsProxies } from '../react-hooks/useCorsProxies';

export const CorsProxiesContext = React.createContext({});
type Props = {children: ReactNode}
const CorsProxiesLoad: FunctionComponent<Props> = ({children}: Props) => {
  const { corsProxies } = useCorsProxies();
  const deepCopyCorsProxies: Record<string, unknown> = { ...JSON.parse(JSON.stringify(corsProxies)) };
  return (
    <CorsProxiesContext.Provider value={deepCopyCorsProxies}>
      {children}
    </CorsProxiesContext.Provider>
  );
};

export default CorsProxiesLoad;
