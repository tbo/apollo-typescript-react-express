import * as React from 'react';
import {Subscription} from 'react-apollo';
import gql from 'graphql-tag';

const viewingCustomer = gql`
  subscription viewingCustomer($customerId: ID!) {
    viewingCustomer(customerId: $customerId) { _id, first, last }
  }
`;

const getUserLabel = ({first, last, _id}) =>
  <span className='badge badge-pill light-blue' style={{margin: 5}} key={_id}>{last}, {first}</span>;

const Viewers = ({customerId}) => (
  <Subscription subscription={viewingCustomer} variables={{customerId}}>
    {({data, loading}) => (
      <div style={{marginTop: 50}}>
        <h5>Watchers</h5>
        {!loading && data.viewingCustomer.map(getUserLabel)}
      </div>
    )}
  </Subscription>
);

export default Viewers;
