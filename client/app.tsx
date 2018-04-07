import * as React from 'react';
import Header from './components/header';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {hot} from 'react-hot-loader';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import Dashboard from './pages/dashboard';
import Customer from './pages/customer';
import Login from './pages/login';

import 'mdbootstrap/css/bootstrap.css';
import 'mdbootstrap/css/mdb.css';
import './common.css';

const history = createBrowserHistory();

const onError = (error) => {
  if (error.networkError && error.networkError.statusCode === 401) {
    history.push('/login');
  }
};

const client = new ApolloClient({onError});

const App = () => (
  <ApolloProvider client={client}>
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
