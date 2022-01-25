const {gql} = require ('apollo-server-express');
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
