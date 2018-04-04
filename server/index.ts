import * as express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import getSchema from './schema';
import {MongoClient} from 'mongodb';
import * as assert from 'assert';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/local';

const app = express();

if (process.env.NODE_ENV === 'development')  {
  /* tslint:disable */
  const stats = {
    colors: false,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false
  }
  const webpackCompiler = require('webpack')(require('../webpack.config'));
  app.use(require('webpack-dev-middleware')(webpackCompiler, {stats, publicPath: '/'}));
  app.use(require("webpack-hot-middleware")(webpackCompiler));
  /* tslint:enable*/
}

MongoClient.connect(url, (err, client) => {
  assert.equal(null, err);
  const db = client.db(client.s.options.dbName);
  app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({schema: getSchema(db), tracing: true, cacheControl: true})
  );
  app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
  app.use('/', express.static('public'));
  app.use('*', express.static('public/index.html'));

  app.listen(3000);

  console.info('Listening on Port http://localhost:3000');
});
