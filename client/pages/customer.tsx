import * as React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const getCustomer = gql`
  query get($userId: ID!) {
   getCustomer(id: $userId) { id, first, last, email }
  }
`;

const Customer = ({data}) => {
  if (data.loading) {
    return <div>Loading...</div>;
  }

  const {last, first, email} = data.getCustomer;
  return (
    <div>
      <b>{last}, {first}</b><br/>
      {email}
    </div>
  );
};

const getOptions = (props) => ({variables: {userId: props.match.params.id}});
export default graphql(getCustomer, {options: getOptions})(Customer);
