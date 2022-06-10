import React, { FunctionComponent } from 'react';

const Donate: FunctionComponent = () => {
  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column'}}>
          email:&nbsp;cole@cafe-society.news
      </div>
      <div>
        source code:&nbsp;
        <a href="https://gitlab.com/cole.albon/news-train">
          https://gitlab.com/cole.albon/news-train
        </a>
      </div>
      <div>bitcoin:&nbsp;
          <a href="https://www.blockchain.com/btc/address/33nkpL1ANUU7kAv27be6FM4BA6RsS4ZegH">33nkpL1ANUU7kAv27be6FM4BA6RsS4ZegH</a>
      </div>
      <div>
        STX:&nbsp;
        <a href="https://explorer.stacks.co/address/SP2A82Q7YZJBKKT6BHD5JXPVZZ9WDRA9AAFTNZGE1?chain=mainnet">SP2A82Q7YZJBKKT6BHD5JXPVZZ9WDRA9AAFTNZGE1</a>
      </div>
    </>
  );
};

export default Donate;
