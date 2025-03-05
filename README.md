# NC News Seeding

Seeding Databases:

1. Create two .env files, one will be to help connect to the development database and the other for the test database.
   The two files should have the following file names:
   - .env.test
   - .env.development
2. Within the `.env.development` copy and paste in the following line:
   PGDATABASE=nc_news
3. Within the `.env.test` copy and paste in the following line:
   PGDATABASE=nc_news_test

Note: The reason for creating these .env files yourself is because these are usually added to a .gitignore file by developers, to avoid pushing sensitive data such as database names and Postgres passwords on to GitHub. By creating a .env file, the Dotenv module will load the environment variables into process.env. This allows you to switch between development and test databases depending on the environment in which the connection is made
