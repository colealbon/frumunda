import { FunctionComponent } from 'react';
import useSWR from 'swr'

import CorsProxiesAdd from './CorsProxiesAdd';
import CorsProxiesReset from './CorsProxiesReset';

import CorsProxyToggle from './CorsProxyToggle';
import CorsProxyDelete from './CorsProxyDelete';

const CorsProxiesEdit: FunctionComponent = () => {

  const { data: corsProxies } = useSWR('corsProxies')

  return (

      <>
        <CorsProxiesAdd key='CorsProxiesAdd' />
        <div />
        <CorsProxiesReset />
        <div />
        {Object.keys(corsProxies as object).map(category => {
          return (
            <div key={`category-edit-${category}`}>
              <CorsProxyToggle text={category} />
              <CorsProxyDelete text={category} />
            </div>
          );
        })}
      </>

  )
};

export default CorsProxiesEdit;
