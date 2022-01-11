const { ApolloServer ,gql} = require ('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require  ('apollo-server-core');
const express= require ('express');
const http = require ('http');
const models = require('./models')
require ('dotenv').config();
const db = require('./db')
const DB_HOST = process.env.DB_HOST

db.connect(DB_HOST);



const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    hello: String!
    notes: [Note!]
    note(id: ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes:  async ()=>{
      return await models.Note.find()
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    }
  },
  Mutation: {
    newNote: async (parent, args) => {
     return await models.Note.create({
        content: args.content,
        author: 'Simon Zach'
     })
    }
  }
};

async function startApolloServer(typeDefs, resolvers) {
  
    const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
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