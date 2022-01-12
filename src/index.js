const { ApolloServer } = require ('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require  ('apollo-server-core');
const express= require ('express');
const http = require ('http');
const models = require('./models')
require ('dotenv').config();
const db = require('./db')
const DB_HOST = process.env.DB_HOST
const typeDefs = require('./schema')
const resolvers = require('./resolvers/index')
const jwt = require('jsonwebtoken');


db.connect(DB_HOST);


// get the user info from a JWT
const getUser = token => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // if there's a problem with the token, throw an error
      throw new Error('Session invalid');
    }
  }
};


async function startApolloServer(typeDefs, resolvers) {
  
    const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization;
      // try to retrieve a user with the token
      const user = getUser(token);
      // for now, let's log the user to the console:
      console.log(user);
      // add the db models and the user to the context
      return { models, user };
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app,path: '/api' });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Apollo Server ready at http://localhost:4000${server.graphqlPath}`);
  app.get('/', function (req, res) {
    res.send('Welcome in note app.')
  })
}

startApolloServer(typeDefs, resolvers)