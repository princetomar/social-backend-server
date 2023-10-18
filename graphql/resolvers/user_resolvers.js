const { UserInputError } = require("@apollo/server");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const {
  validateUserRegister,
  validateUserLogin,
} = require("../../utils/validators");
const { generateUserToken } = require("../../utils/utils");
const Post = require("../../models/Posts");

module.exports = {
  Query: {
    getUser: async (_, { username }) => {
      try {
        const user = await User.findOne({ username: username })
          .populate("followers")
          .populate("following");
        if (!user) {
          throw new Error("User not found");
        } else {
          const posts = await Post.find({ user: user._id })
            .sort({
              createdAt: -1,
            })
            .populate("user"); // Populate the 'user' field in the posts
          user.posts = posts; // Assigning the populated posts to the user
          return user;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    getPostsByUsername: async (_, { username }) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          throw new Error("User not found");
        } else {
          const posts = await Post.find({ user: user._id }).sort({
            createdAt: -1,
          });
          return posts;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    registerUser: async (_, { email, username, password, confirmPassword }) => {
      // Validate the user data
      const { valid, errors } = validateUserRegister(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("User input validation error", { errors });
      }

      // Check if a user with the same email or username already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        errors.username =
          "This username/email is already taken by another user";
        throw new UserInputError("Username/Email already exists", { errors });
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      // Save the user in the database
      const savedUser = await newUser.save();

      // Generate an authentication token (implement this function)
      const token = generateUserToken(savedUser);
      console.log(token);
      return {
        ...savedUser._doc,
        id: savedUser._id,
        token,
      };
    },

    //-------------------------------------------------------------------------
    // NOW Function to login the user

    loginUser: async (_, { email, password }) => {
      const { errors, valid } = validateUserLogin(email, password);
      if (!valid) {
        throw new UserInputError("Empty fields", { errors });
      }

      const user = await User.findOne({ email });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateUserToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};
