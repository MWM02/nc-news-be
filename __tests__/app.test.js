const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each should contain a slug property and a description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object that will contain the properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: 11,
        });
      });
  });

  test("400: Responds with an object containing an error message when the requested article_id is of an invalid data type", () => {
    return request(app)
      .get("/api/articles/two")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an object containing an error message when the requested article_id of valid data type does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles objects sorted by created_at in descending order by default containing the properties: author, title, article_id, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(total_count).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Responds with an array of articles sorted by a valid column in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(total_count).toBe(13);
        expect(articles).toBeSortedBy("author", { descending: false });
      });
  });

  test("200: Responds with an array of articles sorted by a valid column in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        expect(total_count).toBe(13);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("200: Responds with an array of article filtered by a valid topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(total_count).toBe(12);
        });
      });
  });

  test("200: Responds with an empty array when the request query contains a valid topic which does not have any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(0);
      });
  });

  test("200: Responds with an array of articles limited to the specified number in the request query", () => {
    return request(app)
      .get("/api/articles?limit=5")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(5);
        expect(total_count).toBe(13);
      });
  });

  test("200: Responds with an array of articles limited to 10 articles by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(10);
        expect(total_count).toBe(13);
      });
  });

  test("200: Responds with an array of articles offset depending on the page number in the request query", () => {
    return request(app)
      .get("/api/articles?p=2&limit=10&sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(3);
        articles.forEach((article) => {
          expect(article.article_id).toBeGreaterThan(10);
        });
        expect(total_count).toBe(13);
      });
  });

  test("400: Responds with an object containing an error message when the request query contains an invalid data type for page number", () => {
    return request(app)
      .get("/api/articles?p=two&limit=10&sort_by=article_id&order=asc")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an object containing an error message when the request query contains an valid data type for page number that does not exist", () => {
    return request(app)
      .get("/api/articles?p=4&limit=10&sort_by=article_id&order=asc")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Page out of range");
      });
  });

  test("400: Responds with an object containing an error message when the request query contains an invalid data type for limit", () => {
    return request(app)
      .get("/api/articles?limit=two")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an object containing an error message when the request query contains a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=greenhouses")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an object containing an error message when the request query contains an invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=random&order=desc")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe(
          "The specified field is invalid. Please check your input and try again."
        );
      });
  });

  test("400: Responds with an object containing an error message when the request query contains an invalid order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=random")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid order in request query");
      });
  });
});

describe("GET /api/articles/:articles/comments", () => {
  test("200: Responds with an array of comment objects for a given article_id and number of results limited to 10 at most by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("200: Responds with an array of comments limited to the specified number in the request query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(5);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });

  test("200: Responds with an array of comments offset depending on the page number in the request query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=6&p=2")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(5);
        comments.forEach((comment) => {
          expect(new Date(comment.created_at)).toBeBefore(
            new Date("2020-04-14 21:19:00")
          );
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });

  test("200: Responds with an empty array for an article_id that exists in the articles table but does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(0);
      });
  });

  test("400: Responds with an object containing an error message when the request query contains an invalid data type for page number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=two&limit=10")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an object containing an error message when the request query contains an valid data type for page number that does not exist", () => {
    return request(app)
      .get("/api/articles/1/comments?p=100")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Page out of range");
      });
  });

  test("400: Responds with an object containing an error message when the request query contains an invalid data type for limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=two")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("400: Responds with an object containing an error message when the requested article_id is of an invalid data type", () => {
    return request(app)
      .get("/api/articles/two/comments")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an error object containing an error message when the request article_id is of valid data type but does not exist", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object containing the inserted comment", () => {
    const postComment = { username: "lurker", body: "This is a test" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(postComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          author: comment.author,
          body: comment.body,
          article_id: expect.any(Number),
          votes: expect.any(Number),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("201: Responds with an object containing the inserted comment even when the request body has additional properties", () => {
    const postComment = {
      username: "lurker",
      body: "This is a test",
      test: "Ignore",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(postComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          author: comment.author,
          body: comment.body,
          article_id: expect.any(Number),
          votes: expect.any(Number),
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("404: Responds with an error object containing an error message when article_id is of valid data type but does not exist", () => {
    return request(app)
      .post("/api/articles/99/comments")
      .send({ username: "lurker", body: "This is a test" })
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the article_id is of invalid data type", () => {
    return request(app)
      .post("/api/articles/two/comments")
      .send({ username: "lurker", body: "This is a test" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("400: Responds with an error object containing an error message when the request body is lacks necessary properties (username or body)", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ body: "This is a test" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });

  test("400: Responds with an error object containing an error message when the request body's username property contains a username that does not exist in users table", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "fake_user", body: "234" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe(
          "The referenced data does not exist. Please check and try again"
        );
      });
  });

  test("400: Responds with an error object containing an error message when the request body's body property contains an empty string", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with an article object with the updated votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
        expect(article.votes).toBe(0);
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.article_img_url).toBe("string");
      });
  });

  test("404: Responds with an error object containing an error message when article_id is of valid data type but does not exist", () => {
    return request(app)
      .patch("/api/articles/99")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the article_id is of invalid data type", () => {
    return request(app)
      .patch("/api/articles/two")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("400: Responds with an object containing an error message when request body does not contain the correct property", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ votes: 2 })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });

  test("400: Responds with an object containing an error message when the request body contains the required properties but not the valid data types for the values", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "two" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content and the row relating to the comment_id should be removed from the comments table", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        db.query(`SELECT * FROM comments WHERE comment_id = 1`).then(
          ({ rows }) => {
            expect(rows.length).toBe(0);
          }
        );
      });
  });

  test("404: Responds with an error object containing an error message when comment_id is of valid data type but does not exist", () => {
    return request(app)
      .delete("/api/comments/50")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the comment_id is of invalid data type", () => {
    return request(app)
      .delete("/api/comments/L")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects, each should contain a username, name, and an avatar property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with an user object containing the properties username, avatar_url, and name", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          avatar_url: expect.any(String),
          name: expect.any(String),
        });
      });
  });

  test("404: Responds with an object containing an error message when the requested username of valid data type does not exist", () => {
    return request(app)
      .get("/api/users/bob")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with a comment object with the updated votes", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 10 })
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          article_id: expect.any(Number),
          body: expect.any(String),
          votes: 26,
          author: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });

  test("400: Responds with an object containing an error message if the comment_id is of valid data type but does not exist", () => {
    return request(app)
      .patch("/api/comments/99")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the comment_id is of invalid data type", () => {
    return request(app)
      .patch("/api/comments/two")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("400: Responds with an object containing an error message when request body does not contain the correct property", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ votes: 2 })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });

  test("400: Responds with an object containing an error message when the request body contains the required properties but not the valid data types for the values", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: "two" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Responds with the article object that has been inserted into the articles table with an additional comment count", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "test_article",
        topic: "cats",
        author: "lurker",
        body: "test_body",
        article_img_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
          body: expect.any(String),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
  });

  test("201: Responds with the article object with the avatar_img_url defaulted when its not provided in the request body", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "test_article",
        topic: "cats",
        author: "lurker",
        body: "test_body",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
          body: expect.any(String),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: expect.any(Number),
        });
      });
  });

  test("400: Responds with an error object containing an error message when the request body lacks the necessary properties (title, topic, author, body)", () => {
    return request(app)
      .post("/api/articles")
      .send({ topic: "cats", author: "lurker", body: "test_body" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });

  test("400: Responds with an error object containing an error message when the request body's topic or author properties contains a topic or username that does not exist in their respective tables", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "test_article",
        topic: "cats",
        author: "test_user",
        body: "test_body",
        article_img_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe(
          "The referenced data does not exist. Please check and try again"
        );
      });
  });

  test("400: Responds with an error object containing an error message when the request body's body property contains an empty string", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "test_article",
        topic: "cats",
        author: "lurker",
        body: "",
        article_img_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });
});

describe("POST /api/topics", () => {
  test("201: Responds with the topic object that has been inserted into the topics table", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "test-topic",
        description: "This is a test",
        img_url: "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
          img_url: expect.any(String),
        });
      });
  });

  test("201: Responds with the topic object that has been inserted into the topics table with an img_url property defaulted to an empty string when not provided", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "test-topic",
        description: "This is a test",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
          img_url: "",
        });
      });
  });

  test("400: Responds with an error object containing an error message when the request body lacks the necessary properties (slug or description)", () => {
    return request(app)
      .post("/api/topics")
      .send({})
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });

  test("400: Responds with an error object containing an error message when the slug or description properties have falsey values", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "test-topic", description: "" })
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid request body");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: Responds with no content and the row relating to the article_id specified should be removed from the articles table", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        db.query(`SELECT * FROM articles WHERE article_id = 1`).then(
          ({ rows }) => {
            expect(rows.length).toBe(0);
          }
        );
      });
  });

  test("404: Responds with an error object containing an error message when article_id is of valid data type but does not exist", () => {
    return request(app)
      .delete("/api/articles/50")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });

  test("400: Responds with an error object containing an error message when the article_id is of invalid data type", () => {
    return request(app)
      .delete("/api/articles/L")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });
});

describe("Other errors", () => {
  test("404: Responds with an object containing an error message and error code when the requested endpoint doesn't match to any api endpoint", () => {
    return request(app)
      .get("/api/top1cs")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Resource not found");
      });
  });
});
