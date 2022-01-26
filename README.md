# Note App Server

This App was created to show usage of Apollo Server, Express, MongoDB and GraphQL.
In Appollo server api we can create notes and users. All functions presents following schema.

```
module.exports = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    color: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User!]
    title: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favorites:[Note!]!
  }

  type Query {
    hello: String!
    notes: [Note!]
    note(id: ID!): Note!
    user(username: String!): User
    users: [User!]!
    me: User!
  }

  type Mutation {
    newNote(content: String! title: String! color: Int!): Note!
    deleteNote(id: ID!): Boolean
    updateNote(id: ID!, content: String!, title: String!, color: Int!): Note!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    toggleFavorite(id: ID!): Note!
  }

`;
```

Configuration might be found in .env file which occasionally is in repository.

Server was tested on localhost at port 4000

App use MongoDB on port 27017 
> mongodb://localhost:27017/Notedly

#How to run?

Clone repo and create own empty mongoDB data base named Notedly with two empty collections:
> users

> notes

DB can be very easly created with MongoDB Compass desktop app.

When done.

run `nodemon  src/index.js`

GraphQL Apollo Api should be available at localhost:4000/api

The client created for this app is located in noteAppClient repository.
