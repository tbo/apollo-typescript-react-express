import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const Customer = props => (
  <p key={props.id}>
    {props.last}, {props.first}
  </p>
);

const Homepage = (data) => (
  <div>
    <h3>Customers</h3>
    {data.data.getCustomers && data.data.getCustomers.map(Customer)}
  </div>
);

export default graphql(gql`
  {
    getCustomers {
      id,
      first,
      last
    }
  }
`)(Homepage);
