# NC News Seeding

Please set up .env files for the development and test databases.

For the development database, create a file in the root directory called ".env.development"
within this file set the database by writing "PGDATABASE=nc_news"

For the test database, create a file in the root directory called ".env.test"
within this file set the database by writing "PGDATABASE=nc_news_test"

**#NC NEWS**

Here is a link to the API: https://bzz-nc-news.onrender.com/api/ 

This API contains a database and functionality to access several news articles, with user profiles and comments on the articles, with the ability to add votes, avatars and images. It is similar in essence to Reddit.

**minimum version requirements**
Postgres: 8.13.3
Node.js: v23.7.0

**setup**
to open this repo in a dev environment, you will need to install the following dependencies:
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "pg": "^8.13.3",
    "pg-format": "^1.0.4",
    "supertest": "^7.1.0"

dev dependencies:
    "husky": "^8.0.2",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "jest-sorted": "^1.0.15"

  To seed the database, run "setup-dbs" and "seed-dev". I have also written in an automatic seed that should execute before every test.

  To run the tests using jest, run "npm test" To specifically test the application, run "npm test app"
