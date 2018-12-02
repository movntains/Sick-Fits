const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use Express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// Decode the JWT in order to obtain the user ID on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);

    // Put the user ID onto the request for future requests to access
    req.userID = userId;
  }

  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
