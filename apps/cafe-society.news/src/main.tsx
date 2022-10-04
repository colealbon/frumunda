import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './app/components/app';
import './styles.css'

Buffer.from('anything', 'base64');
// eslint-disable-next-line @typescript-eslint/no-var-requires
window.Buffer = window.Buffer || require('buffer').Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
