import * as React from 'react';
import Header from './components/header';
import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { hot } from 'react-hot-loader';
import Homepage from './pages/home';

import '../public/bootstrap.min.css';
import '../public/mdb.min.css';
import '../public/common.css';

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache(),
} as any);

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Header/>
      <main style={{padding: 20}}>
        <Homepage/>
      </main>
    </div>
  </ApolloProvider>
);

export default hot(module)(App);
// export default App;
