import * as React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import Viewers from './viewers';

const getCustomer = gql`
  query get($customerId: ID!) {
    getCustomer(id: $customerId) { id, first, last, email }
  }
`;

const viewCustomer = gql`
  mutation viewCustomer($customerId: ID!) {
    viewCustomer(customerId: $customerId)
  }
`;

const unwatchCustomer = gql`
  mutation viewCustomer($customerId: ID!) {
    unwatchCustomer(customerId: $customerId)
  }
`;

class Customer extends React.Component<{query: any, mutation: any, match: any, unwatch: any}> {
  public componentDidMount() {
    setTimeout(this.props.mutation, 500);
  }

  public componentWillUnmount() {
    this.props.unwatch();
  }

  public render() {
    if (this.props.query.loading) {
      return <div>Loading...</div>;
    }

    const {last, first, email} = this.props.query.getCustomer;
    return (
      <div>
        <div className='card' style={{padding: 20}}>
          <b>{last}, {first}</b><br/>
          <span><i className='fa fa-envelope'/> {email}</span>
        </div>
        <Viewers customerId={this.props.match.params.id}/>
      </div>
    );
  }
}

const getOptions = (name: string) => ({
  name,
  options: (props) => ({variables: {customerId: props.match.params.id}})
});
export default graphql(viewCustomer, getOptions('mutation'))(
  graphql(unwatchCustomer, getOptions('unwatch'))(
  graphql(getCustomer, getOptions('query'))(Customer)));
