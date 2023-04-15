const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

function authMiddleware({ req }) {
  let token = req.headers.authorization || "";

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  if (!token) {
    return;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch (err) {
    console.log("Invalid token");
    throw new AuthenticationError("Invalid token");
  }
}

module.exports = authMiddleware;
