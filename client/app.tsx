import * as React from 'react';
import Header from './components/header';
import Navigation from './components/navigation';
import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { hot } from 'react-hot-loader';
import Homepage from './pages/home';

const client = new ApolloClient({
  link: new HttpLink(),
  cache: new InMemoryCache(),
} as any);

const App = () => (
  <ApolloProvider client={client}>
    <div style={{paddingLeft: 20, paddingRight: 20}}>
      <Header/>
      <Navigation activePath=''/>
      <main style={{paddingTop: 20, paddingBottom: 20}}>
        <Homepage/>
      </main>
    </div>
  </ApolloProvider>
);

export default hot(module)(App);
// export default App;
