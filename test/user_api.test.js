const { test, describe, after } = require("node:test");
const assert = require("assert");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("User creation", () => {
  test.only("creation fails with proper statuscode and message if username is too short", async () => {
    const newUser = {
      username: "us", // Nombre de usuario demasiado corto
      password: "password123",
      name: "Test User",
    };

    const response = await request(app).post("/api/users").send(newUser);

    assert.strictEqual(response.status, 400);
    assert(response.body.error.includes("username"));
  });

  test("creation fails with proper statuscode and message if username is already taken", async () => {
    const existingUser = {
      username: "existinguser",
      password: "password123",
      name: "Existing User",
    };

    // Crear un usuario con el mismo nombre de usuario que ya existe
    await request(app).post("/api/users").send(existingUser);

    // Intentar crear otro usuario con el mismo nombre de usuario
    const duplicateUser = {
      username: "existinguser",
      password: "anotherpassword",
      name: "Another User",
    };

    const response = await request(app).post("/api/users").send(duplicateUser);

    assert.strictEqual(response.status, 400);
    assert(response.body.error.includes("username"));
  });

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const newUser = {
      username: "test",
      password: "sh", // Contraseña demasiado corta
      name: "Short User",
    };

    const response = await request(app).post("/api/users").send(newUser);

    assert.strictEqual(response.status, 400);
    assert(response.body.error.includes("password"));
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
