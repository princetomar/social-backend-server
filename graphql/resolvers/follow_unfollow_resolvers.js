const User = require("../../models/User");

const followResolvers = {
  Mutation: {
    followUser: async (_, { selectedUserId, loggedInUserId }) => {
      try {
        const userToFollow = await User.findById(selectedUserId);
        const currentUser = await User.findById(loggedInUserId);

        if (!userToFollow || !currentUser) {
          throw new UserInputError("User not found", { status: 404 });
        }

        if (
          currentUser.following.some(
            (user) => user._id.toString() === selectedUserId
          )
        ) {
          throw new Error("You are already following this user");
        }

        // Append the userToFollow to the current logged-in user's following list
        currentUser.following.push(userToFollow);
        await currentUser.save();

        // Append the current user to the selectedUser's followers list
        userToFollow.followers.push(currentUser);
        await userToFollow.save();

        return currentUser;
      } catch (err) {
        console.log(`Error while following user: ${err}`);
        throw new UserInputError(`Error while following user: ${err.message}`, {
          status: 404,
        });
      }
    },

    // TO UNFOLLOW USER
    unfollowUser: async (_, { selectedUserId, loggedInUserId }) => {
      try {
        const userToUnfollow = await User.findById(selectedUserId);
        const currentUser = await User.findById(loggedInUserId);

        if (!userToUnfollow || !currentUser) {
          throw new UserInputError("User not found", { status: 404 });
        }

        // Remove the userToUnfollow from the current logged-in user's following list
        currentUser.following = currentUser.following.filter(
          (user) => user._id.toString() !== selectedUserId
        );
        await currentUser.save();

        // Remove the current user from the selectedUser's followers list
        userToUnfollow.followers = userToUnfollow.followers.filter(
          (user) => user._id.toString() !== loggedInUserId
        );
        await userToUnfollow.save();

        return currentUser;
      } catch (err) {
        console.log(`Error while unfollowing user: ${err}`);
        throw new UserInputError(
          `Error while unfollowing user: ${err.message}`,
          { status: 404 }
        );
      }
    },
  },
};

module.exports = followResolvers;
