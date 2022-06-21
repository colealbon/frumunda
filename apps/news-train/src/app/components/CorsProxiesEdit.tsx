import React, { FunctionComponent, Suspense } from 'react';
import { useCorsProxies } from '../react-hooks/useCorsProxies'

import CorsProxiesAdd from './CorsProxiesAdd';
import CorsProxiesReset from './CorsProxiesReset';

import CorsProxyToggle from './CorsProxyToggle';
import CorsProxyDelete from './CorsProxyDelete';

const CorsProxiesEdit: FunctionComponent = () => {
  const { corsProxies } = useCorsProxies()

  return (
      <Suspense fallback={<h2>fetching cors proxies.</h2>}>
        <>
          <CorsProxiesAdd key='CorsProxiesAdd' />
          <div />
          <CorsProxiesReset />
          <div />
          {Object.keys(JSON.parse(JSON.stringify(corsProxies))).map(corsProxy => {
            return (
              <div key={`corsProxy-edit-${corsProxy}`}>
                <CorsProxyToggle text={corsProxy} />
                <CorsProxyDelete text={corsProxy} />
              </div>
            );
          })}
        </>
      </Suspense>
  )
};

export default CorsProxiesEdit;
