import { FunctionComponent } from 'react';
import useSWR from 'swr'
import {useStacks} from '../react-hooks/useStacks'

import defaultCorsProxies from '../react-hooks/defaultCorsProxies.json'

import CorsProxiesAdd from './CorsProxiesAdd';
import CorsProxiesReset from './CorsProxiesReset';

import CorsProxyToggle from './CorsProxyToggle';
import CorsProxyDelete from './CorsProxyDelete';

const CorsProxiesEdit: FunctionComponent = () => {
  const {fetchFileLocal} = useStacks()
  const {data: corsProxiesdata} = useSWR('corsProxies', fetchFileLocal('corsProxies', defaultCorsProxies), {fallbackData: defaultCorsProxies})
  const corsProxies = {...corsProxiesdata as object}

  return (
      <>
        <CorsProxiesAdd key='CorsProxiesAdd' />
        <div />
        <CorsProxiesReset />
        <div />
        {Object.keys(corsProxies as object).map(category => {
          return (
            <div key={`category-edit-${category}`}>
              <CorsProxyDelete text={category} />
              <CorsProxyToggle text={category} />
            </div>
          );
        })}
      </>

  )
};

export default CorsProxiesEdit;
