import * as express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import getSchema from './schema';
import {MongoClient} from 'mongodb';
import * as assert from 'assert';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/local';

const app = express();

MongoClient.connect(url, (error, client) => {
  assert.equal(null, error);
  const db = client.db(client.s.options.dbName);

  if (process.env.NODE_ENV === 'development')  {
    const webpackCompiler = require('webpack')(require('../webpack.config'));
    app.use(require('webpack-dev-middleware')(webpackCompiler, {stats: 'errors-only', publicPath: '/'}));
    app.use(require('webpack-hot-middleware')(webpackCompiler));
    app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
  }

  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({schema: getSchema(db), tracing: true, cacheControl: true})
  );
  app.use('/', express.static('public'));
  app.use('*', express.static('public/index.html'));

  app.listen(3000);

  console.info('Listening on Port http://localhost:3000');
});
