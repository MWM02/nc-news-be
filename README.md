# News API

## Hosted Version

You can find the hosted version of this API, with a complete list of available endpoints, here: https://news-site-mta3.onrender.com/api

## Project Overview

This is a RESTful API for a Reddit-style news site. It provides endpoints for managing articles, comments, users, and topics. The API enables users to perform CRUD operations on these resources. It also supports filtering, sorting, and pagination for articles. For more information on the endpoints and corresponding methods available, please check the **`endpoints.json`** file in the repo or click the link above.

## Getting Started

### Prerequisites

Ensure you have the following installed before proceeding:

- **Node.js** v16 or later

- **PostgreSQL** v14 or later

- **Visual Studio Code** (or an IDE of your choice)

### Installation & Setup

Follow these steps to set up the project locally using the Command Line Interface:

1.  **Clone the repository**:

    ```
    git clone https://github.com/MWM02/news-site.git
    ```

2.  **Open the cloned directory**:

    - Change to cloned directory:

      ```
      cd news-site
      ```

    - Open in Visual Studio Code (or open directory from inside VS Code using File > Open Folder):
      ```
      code .
      ```

3.  **Install dependencies**:

    ```
    npm install
    ```

4.  **Setup databases** (development and test):

    ```
    npm run setup-dbs
    ```

5.  **Create** **`.env`** **files**:

    Create two environment variable files in the root directory:

    - `.env.development`:

      ```
      PGDATABASE=nc_news
      ```

    - `.env.test`:

      ```
      PGDATABASE=nc_news_test
      ```

    **Note:** These files are ignored by Git (via `.gitignore`) to prevent sensitive information (such as passwords or API keys) from being pushed to GitHub. The Dotenv module will load these environment variables into `process.env`, and will switch between development and test databases as needed.

6.  **Seed the databases**:

    - Seed the development database:

      ```
      npm run dev-seed
      ```

    - Seed the test database:

      ```
      npm run test-seed
      ```

7.  **Run tests**:

    ```
    npm run test
    ```

8.  **Running the API locally**:

    ```
    npm run start
    ```

- The API will be running on port 9999 by default.
- Use a tool like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to send requests to `http://localhost:9999/`.

## Tech Stack

This project was built using the following technologies:

**Node.js** - JavaScript runtime environment

**PostgreSQL** - Relational database

**Express.js** - Web framework for Node.js

**Jest** - JavaScript testing framework

**Supertest** - HTTP assertions for testing

**Render** - Hosting service for the API

**Supabase** - Managed PostgreSQL database hosting
