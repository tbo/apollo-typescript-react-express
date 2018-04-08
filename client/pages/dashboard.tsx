import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {Link} from 'react-router-dom';

const Customer = ({first, last, id}) => (
  <p>
    <i className='fa fa-user-o' style={{marginRight: 10}}/>
    <Link to={`/customer/${id}`}>{last}, {first}</Link>
  </p>
);

const Homepage = (data) => (
  <div>
    <div className='card' style={{padding: 20, maxWidth: 450}}>
      <h4 style={{marginBottom: 20}}>Recently Viewed</h4>
      {data.data.getUser && data.data.getUser.recentlyViewed && data.data.getUser.recentlyViewed.map(Customer)}
    </div>
  </div>
);

export default graphql(
  gql`{ getUser { recentlyViewed { id, first, last } } }`,
  {options: {fetchPolicy: 'network-only'}})(Homepage);
