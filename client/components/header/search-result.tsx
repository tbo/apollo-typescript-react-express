import * as React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Link} from 'react-router-dom';

const searchCustomer = gql`
  query search($searchTerm: String!) {
   searchCustomers(query: $searchTerm, limit: 20) { id, first, last, email }
  }
`;

const handleSearchResult = ({data}) => (
  <ul>
    {data.searchCustomers && data.searchCustomers.map(getSearchResulItem)}
  </ul>
);

const getSearchResulItem = ({id, first, last}) => (
  <li key={id}>
    <Link to={`/customer/${id}`}>{last}, {first}</Link>
  </li>
);

const SearchResult = ({searchTerm, top}) => (
  <section className='navbar fixed-top navbar-expand-lg navbar-light scrolling-navbar white lighten-5' style={{top}}>
    <Query query={searchCustomer} variables={{searchTerm}}>
      {handleSearchResult}
    </Query>
  </section>
);

export default SearchResult;
