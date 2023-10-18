const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken"); // Import the jwt module

// module.exports = (ctx) => {
//   const authHeader = ctx.req.headers.authorization;
//   if (authHeader) {
//     // Bearer toeken
//     const authToken = authHeader.split("Bearer ")[1];
//     if (token) {
//       try {
//         const user = jwt.verify(token, process.env.JWT_TOKEN);
//         return user;
//       } catch (err) {
//         throw new AuthenticationError("Invalid or expired token");
//       }
//     }
//     throw new Error('Authentication token must be "Bearer [token]');
//   }
//   throw new Error("Kindly provide the authorization headers");
// };

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer token
    const authToken = authHeader.split("Bearer ")[1]; // Corrected variable name (from token to authToken)
    if (authToken) {
      try {
        // Verify the JWT token and return the user if valid
        const user = jwt.verify(authToken, process.env.JWT_TOKEN);
        return { userId: user.userId, username: user.username }; // Adjust this according to your user data structure
      } catch (err) {
        throw new AuthenticationError("Invalid or expired token");
      }
    }
    throw new AuthenticationError(
      'Authentication token must be in the format "Bearer [token]"'
    );
  }
  throw new AuthenticationError("Authorization header must be provided");
};
