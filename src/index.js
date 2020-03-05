import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import * as hooks from './hooks';
import { useDevTools } from './palpatine';
import './index.scss';

useDevTools(hooks, { log: true, logPrimitivesOnly: false });

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();

window.addEventListener('beforeinstallprompt', deferredPromptEvent => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  deferredPromptEvent.preventDefault();
  deferredPromptEvent.prompt();
});
