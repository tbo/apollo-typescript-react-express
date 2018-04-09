import * as React from 'react';
import Header from './components/header';
import {ApolloClient} from 'apollo-client';
import {split, from} from 'apollo-link';
import {WebSocketLink} from 'apollo-link-ws';
import {HttpLink} from 'apollo-link-http';
import {ApolloProvider} from 'react-apollo';
import {onError} from 'apollo-link-error';
import {getMainDefinition} from 'apollo-utilities';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {hot} from 'react-hot-loader';
import {Router, Route, Switch} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Customer from './pages/customer';
import Login from './pages/login';

import 'mdbootstrap/css/bootstrap.css';
import 'mdbootstrap/css/mdb.css';
import 'font-awesome/css/font-awesome.css';
import './common.css';

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include'
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/subscriptions`,
  options: {reconnect: true}
});

const getLink = history => split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  from([getErrorLink(history), httpLink])
);

const getErrorLink = history => onError((error) => {
  if (error.networkError && (error.networkError as any).statusCode === 401) {
    history.push('/login');
  }
});

const getClient = (history) => new ApolloClient({link: getLink(history), cache: new InMemoryCache()});

const App = ({history}) => (
  <ApolloProvider client={getClient(history)}>
    <Router history={history}>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <Route render={() => (
          <div>
            <Header/>
            <main style={{padding: 20}}>
              <Route exact path='/' component={Dashboard}/>
              <Route path='/customer/:id' component={Customer}/>
            </main>
          </div>
        )}/>
      </Switch>
    </Router>
  </ApolloProvider>
);

export default hot(module)(App);
// export default App;
