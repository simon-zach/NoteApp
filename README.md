# Note App Server

This App was created to show usage of Apollo Server, Express, MongoDB and GraphQL.

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
