import * as express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import getSchema from './schema';
import * as cookieParser from 'cookie-parser';
import {MongoClient} from 'mongodb';
import * as assert from 'assert';
import * as jwtMiddleware from 'express-jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/local';

const app = express();

const authenticate = db => (req, res) => {
  const {username, password} = req.body;
  db.collection('users').findOne({username}, (err, user) => {
    if (err || !user) {
      return res.status(401).send('User unknown');
    }
    bcrypt.compare(password, user.password, (hashErr, result) => {
      const authToken = jwt.sign({userId: user._id}, 'shhhhhhared-secret');
      if (hashErr || !result) {
        return res.status(401).send('Wrong password');
      }
      res
        .set('P3P', 'CP="This is not a P3P policy!"')
        .cookie('token', authToken, {httpOnly: true, secure: false})
        .send({data: {userId: user._id, authToken}});
    });
  });
};

const validateToken = (req, res, next) => {
  try {
    req.userId = jwt.verify(req.cookies.token, 'shhhhhhared-secret');
    // This should never happen, but querying without a userId would have
    // serious security implications, so it is being checked explicitly.
    if (!req.userId) {
      return res.sendStatus(401);
    }
  } catch (err) {
    return res.sendStatus(401);
  }
  next();
};

MongoClient.connect(url, (error, client) => {
  assert.equal(null, error);
  const db = client.db(client.s.options.dbName);

  if (process.env.NODE_ENV === 'development')  {
    app.use(require('connect-history-api-fallback')());
    const webpackCompiler = require('webpack')(require('../webpack.config'));
    app.use(require('webpack-dev-middleware')(webpackCompiler, {stats: 'errors-only', publicPath: '/'}));
    app.use(require('webpack-hot-middleware')(webpackCompiler));
    app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
  }

  app.get('/', express.static('public'));
  app.post('/authenticate', bodyParser.json(), authenticate(db));
  app.post(
    '/graphql',
    cookieParser(),
    validateToken,
    bodyParser.json(),
    graphqlExpress({schema: getSchema(db), tracing: true, cacheControl: true})
  );
  app.use('*', express.static('public/index.html'));

  app.listen(3000);

  console.info('Listening on Port http://localhost:3000');
});
