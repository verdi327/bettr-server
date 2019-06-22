# Bettr Api

Fitness training simplified.  Automatically generate 12 week training programs individualized to your training level, sex and training availability.

This is the backend for `bettr.fit`. The front end client can be found at [https://github.com/verdi327/bettr-server](https://github.com/verdi327/bettr-server).

## Introduction

With so much information available on the web and social media sites around training advice, it's hard to separate fact from fiction. Bettr cuts through the BS and builds 12 week training programs that use evidence based science to create balanced, full body training plans. If you want both better body composition, performance and longevity - bettr is your plan.

## Quick App Demo

![Imgur](https://i.imgur.com/OyZdffc.gif)

## Technology

#### Back End

* Node and Express
  * Authentication via JWT
  * RESTful Api
* Testing
  * Supertest (integration)
  * Mocha and Chai (unit)
* Database
 * Postgres
 * Knex.js - SQL wrapper

#### Production

Deployed via Heroku


## Set up

Major dependencies for this repo include Postgres and Node.

To get setup locally, do the following:

1. Clone this repository to your machine, `cd` into the directory and run `npm install`
2. Create the dev and test databases: `createdb -U postgres -d bettr-dev` and `createdb -U postgres -d bettr-test`

3. Create a `.env` and a `.env.test` file in the project root

Inside these files you'll need the following:

````
NODE_ENV=development
PORT=8000

MIGRATION_DB_HOST=localhost
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=bettr-dev
MIGRATION_DB_USER=postgres
DEV_DB_URL="postgresql://postgres@localhost/bettr-dev"

JWT_SECRET=<your-secret-here>
JWT_EXPIRY='1w'
````

Your `.env.test` will be the same except your database url will be called `TEST_DB_URL`

4. Run the migrations for dev - `npm run migrate`
5. Run the migrations for test - `NODE_ENV=test npm run migrate`
6. Seed the database for dev

* `psql -U <db-user> -d bettr-dev -f ./seeds/seed.exercises.sql`
* `psql -U <db-user> -d bettr-dev -f ./seeds/seed.cardio-workouts.sql`
* `psql -U <db-user> -d bettr-dev -f ./seeds/seed.hybrid-workouts.sql`

Now, run those three commands above again for the test database as well.

7. Run the tests - `npm t`
8. Start the app - `npm run dev`