const { ApolloServer ,gql} = require ('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require  ('apollo-server-core');
const express= require ('express');
const http = require ('http');

let notes = [
    {
      id: '1',
      content: 'This is a note',
      author: 'Adam Scott'
    },
    {
      id: '2',
      content: 'This is another note',
      author: 'Harlow Everly'
    },
    {
      id: '3',
      content: 'Oh hey look, another note!',
      author: 'Riley Harrison'
    }
  ];
const typeDefs = gql`
  type Note {
    id: ID
    content: String
    author: String
  }

  type Query {
    hello: String
    notes: [Note]
    note(id: ID): Note
  }

  type Mutation {
    newNote(content: String!): Note
  }
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes: () => notes,
    note: (parent, args) => {
      return notes.find(note => note.id === args.id);
    }
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'Adam Scott'
      };
      notes.push(noteValue);
      return noteValue;
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
 
}

startApolloServer(typeDefs, resolvers)