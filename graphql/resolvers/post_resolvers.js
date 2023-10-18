const Post = require("../../models/Posts");
const User = require("../../models/User");

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const allPosts = await Post.find().sort({ createdAt: -1 });
        console.log("All posts:", allPosts);
        return allPosts;
      } catch (err) {
        console.error("Error retrieving posts:", err);
        throw new Error("Failed to retrieve posts");
      }
    },
    // getImagePosts: async () => {
    //   console.log("This function is being called.");
    //   console.log("Exe:");
    //   try {
    //     const allPosts = await Post.find().sort({ createdAt: -1 });
    //     console.log("All posts:", allPosts);
    //     return allPosts;
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // },

    getSinglePost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
        } else {
          return post;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    // 1. POST A TEXT
    createTextPost: async (_, { input }) => {
      try {
        // Check if the user exists
        const user = await User.findById(input.userId);

        if (!user) {
          throw new Error("User not found");
        }

        // Create a new text post
        const newPost = new Post({
          type: "text",
          body: input.text,
          user: input.userId,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        const savedPost = await newPost.save();

        return savedPost;
      } catch (error) {
        throw new Error(
          `An error occurred while creating the text post: ${error.message}`
        );
      }
    },
    // 2. POST A IMAGE
    createImagePost: async (_, { input }, context) => {
      try {
        // Check if the user exists
        const user = await User.findById(input.userId);

        if (!user) {
          console.error("Error: User not found!");
        }

        // Create a new image post
        const newPost = new Post({
          type: input.type,
          body: input.image,
          user: user._id,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        const savedPost = await newPost.save();

        return savedPost;
      } catch (error) {
        console.error("Error creating image post: ", error);
      }
    },
    // 3. DELETE IMAGE POST
    deletePost: async (_, { postId, userId }) => {
      try {
        // Convert userId to ObjectId
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        // Convert postId to ObjectId
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post not found");
        }

        if (user.username.toString() !== post.username.toString()) {
          throw new Error("Action not allowed");
        }

        await Post.deleteOne({ _id: postId }); // Deleting the post
        return "Post deleted successfully";
      } catch (error) {
        console.error("Error deleting post: ", error.message);
        throw new Error("Failed to delete post");
      }
    },
  },
};
