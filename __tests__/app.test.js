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
      .get("/api/articles/2")
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
        });
      });
  });

  test("400: Responds with an object containing an error message and error code when the requested article_id is of an invalid data type", () => {
    return request(app)
      .get("/api/articles/two")
      .expect(400)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("Invalid text representation");
      });
  });

  test("404: Responds with an object containing an error message and error code when the requested article_id of valid data type does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error.message).toBe("No matches found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles objects sorted by created_at in descending order containing the properties: author, title, article_id, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
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
        expect(articles).toBeSortedBy("created_at", { descending: true });
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
