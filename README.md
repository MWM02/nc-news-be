# NC News Seeding

Seeding Databases:

1. Create two .env files, one will be to help connect to the development database and the other for the test database.
   The two files should have the following file names:
   .env.test
   .env.development
2. Within the `.env.development` copy and paste in the following line:
   PGDATABASE=nc_news
3. Within the `.env.test` copy and paste in the following line:
   PGDATABASE=nc_news_test

Note: The reason for creating these .env files yourself is because these are added to a .gitignore file, to avoid pushing sensitive data such as database names and/or Postgres passwords on to GitHub.
