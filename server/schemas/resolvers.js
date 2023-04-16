const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    // get a single user by either their id or their username
    async me(parent, args, context) {
      if (!context.user) {
        throw new Error("You need to be logged in!");
      }

      const foundUser = await User.findOne({
        _id: context.user._id,
      });

      if (!foundUser) {
        throw new Error("Cannot find a user with this id!");
      }

      return foundUser;
    },
  },

  Mutation: {
    // create a user, sign a token, and send it back
    async addUser(parent, args) {
      const user = await User.create(args);

      if (!user) {
        throw new Error("Something is wrong!");
      }

      const token = signToken(user);
      return { token, user };
    },

    // login a user, sign a token, and send it back
    async login(parent, args) {
      const user = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw new Error("Wrong password!");
      }

      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    saveBook: async (parent, args, context) => {
      console.log("newBook:", args.newBook);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $push: { savedBooks: args.newBook },
          },
          {
            new: true,
            // runValidators: true,
          }
        );
        console.log(updatedUser);
        console.log("saved books:", updatedUser.savedBooks);
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // remove a book from `savedBooks`
    async removeBook(parent, args, context) {
      console.log("removeBook resolver called with args:", args);
      console.log("context.user:", context.user);

      if (!context.user) {
        throw new Error("You need to be logged in!");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
      );

      console.log("updatedUser:", updatedUser);

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
  },
};

module.exports = resolvers;
