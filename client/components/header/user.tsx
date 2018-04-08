import * as React from 'react';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {Link} from 'react-router-dom';

const getUser = gql`
  { getUser { first, last } }
`;

const handleSearchResult = ({data, loading}) => {
  if (loading) {
    return null;
  }
  const {first, last} = data.getUser;
  return (
    <div>
      <i className='fa fa-user-circle-o'/> {first} {last}
    </div>
  );
};

const SearchResult = () => (
  <Query query={getUser}>
    {handleSearchResult}
  </Query>
);

export default SearchResult;
