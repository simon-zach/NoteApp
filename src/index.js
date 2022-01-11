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
db.connect(DB_HOST);





async function startApolloServer(typeDefs, resolvers) {
  
    const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:{ models},
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app,path: '/api' });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  app.get('/', function (req, res) {
    res.send('hello world')
  })
}

startApolloServer(typeDefs, resolvers)