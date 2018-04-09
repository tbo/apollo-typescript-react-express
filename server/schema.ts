import {makeExecutableSchema} from 'graphql-tools';
import {PubSub} from 'graphql-subscriptions';
import {ObjectId} from 'mongodb';
import {uniq} from 'ramda';

const typeDefs = [`
  type Query {
    getCustomer(id: ID): customer
    searchCustomers(limit: Int, query: String!): [customer]
    getUser: user
  }
  type Mutation {
    viewCustomer(customerId: ID): Boolean
    unwatchCustomer(customerId: ID): Boolean
  }
  type Subscription {
    viewingCustomer(customerId: ID): [user]
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
  type user @cacheControl(maxAge: 60) {
    _id: ID!
    first: String!
    last: String!
    email: String
    company: String
    country: String
    recentlyViewed: [customer]
  }
  type correspondence @cacheControl(maxAge: 60) {
    name: String!
    date: String!
    meta: String
    customerId: ID
  }
`];

const pubsub = new PubSub();
const watchers = {};

const getRecentlyViewed = (db, customerIds: number[]) => () =>
  db.collection('customers').find({id: {$in: customerIds}}).toArray()
    .then(customers => customers.sort((a, b) => customerIds.indexOf(a.id) - customerIds.indexOf(b.id)));

const getResolvers = (db) => ({
  Query: {
    getCustomer(root, {id}, context) {
      return db.collection('customers').findOne({id: parseInt(id, 10)});
    },
    getUser(root, _, {session}) {
      return db.collection('users').findOne({_id: new ObjectId(session.userId)})
        .then(user => ({...user, recentlyViewed: getRecentlyViewed(db, user.recentlyViewedCustomers)}));
    },
    searchCustomers(root, {limit, query}, context) {
      const regex = new RegExp(`.*${query}.*`, 'i');
      return db.collection('customers').find({$or: [{first: regex}, {last: regex}]}).limit(limit || 100).toArray();
    }
  },
  Mutation: {
    unwatchCustomer(root, {customerId}, {session}) {
      if (Array.isArray(watchers[customerId])) {
        if (watchers[customerId].length === 1) {
          delete watchers[customerId];
        } else {
          watchers[customerId] = watchers[customerId].filter(watcher => watcher !== session.userId);
        }
      }
      pubsub.publish(`viewingCustomer:${customerId}`, {watchers: watchers[customerId]});
    },
    viewCustomer(root, {customerId}, {session}) {
      if (watchers[customerId]) {
        watchers[customerId].push(session.userId);
      } else {
        watchers[customerId] = [session.userId];
      }
      pubsub.publish(`viewingCustomer:${customerId}`, {watchers: watchers[customerId]});
      return db.collection('users').find({_id: new ObjectId(session.userId)}).snapshot().forEach((doc) => {
        doc.recentlyViewedCustomers = uniq([parseInt(customerId, 10), ...doc.recentlyViewedCustomers]).slice(0, 10);
        db.collection('users').save(doc);
      });
    }
  },
  Subscription: {
    viewingCustomer: {
      resolve: (payload, args, context, info) => {
        if (!payload.watchers) {
          return [];
        }
        const userIds = payload.watchers.map(watcher => new ObjectId(watcher));
        return db.collection('users').find({_id: {$in: userIds}}).toArray();
      },
      subscribe: (payload, {customerId}) =>
        pubsub.asyncIterator(`viewingCustomer:${customerId}`)
    },
  },
});

export default (db) => makeExecutableSchema({typeDefs, resolvers: getResolvers(db)});
