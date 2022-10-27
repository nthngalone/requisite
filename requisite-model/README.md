# Requisite Model

Shared model for the Requisite platform.

## Verdaccio Setup
This project requires a local NPM registry running.  The `requisite-verdaccio` project provides a quick way to get up and running with Verdaccio NPM Registry.  Clone the repo,
then run:
```
npm install
npm run start
npm adduser --registry http://localhost:4873
    username: requisite
    password: npm#p@$$w0rd
    email: nthngalone@gmail.com
```
