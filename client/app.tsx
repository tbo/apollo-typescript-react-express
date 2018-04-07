import * as React from 'react';
import Header from './components/header';
import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { hot } from 'react-hot-loader';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Customer from './pages/customer';

import 'mdbootstrap/css/bootstrap.css';
import 'mdbootstrap/css/mdb.css';
import './common.css';

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache(),
} as any);

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Header/>
        <main style={{padding: 20}}>
          <Route exact path='/' component={Dashboard}/>
          <Route path='/customer/:id' component={Customer}/>
        </main>
      </div>
    </Router>
  </ApolloProvider>
);

export default hot(module)(App);
// export default App;
