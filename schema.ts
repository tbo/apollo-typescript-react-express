import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = [`
  type Query {
    getCustomers(limit: Int): [customer]
  }
  type customer @cacheControl(maxAge: 60) {
    id: ID
    first: String!
    last: String!
    created_at: String!
    email: String
    company: String
    country: String
  }
  type correspondence @cacheControl(maxAge: 60) {
    name: String!
    date: String!
    meta: String
    customerId: ID
  }
`];

const getResolvers = (db) => ({
  Query: {
    getCustomers(root, {limit, ...query}, context) {
      return db.collection('customers').find(query).limit(limit || 100).toArray();
    }
  }
});

export default (db) => makeExecutableSchema({typeDefs, resolvers: getResolvers(db)});
