import * as React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

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

class Customer extends React.Component<{query: any, mutation: any, match: any}> {
  public componentDidMount() {
    this.props.mutation();
  }

  public render() {
    if (this.props.query.loading) {
      return <div>Loading...</div>;
    }

    const {last, first, email} = this.props.query.getCustomer;
    return (
      <div>
        <b>{last}, {first}</b><br/>
        {email}
      </div>
    );
  }
}

const getOptions = (name: string) => ({
  name,
  options: (props) => ({variables: {customerId: props.match.params.id}})
});
export default graphql(viewCustomer, getOptions('mutation'))(
  graphql(getCustomer, getOptions('query'))(Customer));
