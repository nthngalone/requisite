# Requisite API

RESTful Web API for the Requisite platform.

## Run a Single Unit Test
```
npm run test --workspace=requisite-api -- tests/orgs/supertest.app.orgs.list.post.test.ts
```

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

## Docker

Swarm stack deploy guides:
https://docs.docker.com/engine/swarm/stack-deploy/
https://takacsmark.com/docker-swarm-tutorial-for-beginners/
https://stackoverflow.com/questions/38602903/docker-swarm-init-could-not-choose-an-ip-address-error

Initialize Docker Swarm if not already done
`sudo docker swarm init`
`sudo docker swarm init --advertise-addr 10.138.1.234`
`sudo docker swarm leave --force` // leave swarm mode

Build the container
`sudo docker-compose build`

Test container image with docker-compose
`sudo docker-compose up -d`
`sudo docker-compose ps`
`curl http://localhost:3000`
`sudo docker-compose down --volumes`

Deploy the stack to Docker Swarm
`sudo docker stack deploy requisite -c docker-compose.yml`

Access the Site
I think you have to use an IP address if you had to specify --advertise-addr on swarm init.  Localhost doesn't know where to go
`curl http://127.0.0.1:3000`
`curl http://10.138.1.234:3000`
`curl http://localhost:3000 just churns`

Remove the stack from Docker Swarm
`sudo docker stack rm requisite`

List deployed stacks in Docker Swarm
`sudo docker stack ls`

List services in the deployed stack
`sudo docker stack services requisite`

List task details on a stack
`sudo docker stack ps requisite`

View log from a service
`sudo docker service logs requisite_api`

Start a shell in the container
`sudo docker ps` to get the container id or name
`sudo docker exec -it <container-id-or-name> sh`
`sudo docker exec -it <container-id-or-name> /bin/bash` (if bash is available)

## Sequelize Notes

### Associations

- one-to-one
    - belongsTo: foreign key belongs to local table
    - hasOne: foreign key belongs to joined table

- one-to-many
    - hasMany: foreign key belongs to joined table