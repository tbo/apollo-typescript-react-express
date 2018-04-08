import App from './app';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';

const history = createBrowserHistory();

const rootElement = document.createElement('DIV');

const render = Component => ReactDOM.render(<Component history={history}/>, rootElement);

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(rootElement);
  render(App);
});

declare var module: { hot: any; exports: any; };
if (module && module.hot) {
  module.hot.accept('./index.tsx');
  module.hot.accept('./app', () => render(require('./app').default));
}
