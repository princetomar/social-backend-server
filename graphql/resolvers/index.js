const postResolvers = require("./post_resolvers");
const userResolvers = require("./user_resolvers");
const followResolvers = require("./follow_unfollow_resolvers");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...followResolvers.Mutation,
  },
};
