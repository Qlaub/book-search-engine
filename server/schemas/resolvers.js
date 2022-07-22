const { ApolloError, AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // get a single user by either their id or their username
    async getSingleUser(parent, params, context) {
      const foundUser = await User.findOne({
        $or: [{ _id: context.user ? context.user._id : params.id }, { username: params.username }],
      });
  
      if (!foundUser) {
        throw new ApolloError ('Cannot find a user with this id!');
      }
  
      return foundUser;
    },
  },

  Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    createUser: async (parent, args) => {
      const user = await User.create(args);
  
      if (!user) {
        throw new ApolloError ('Something is wrong!');
      }

      const token = signToken(user)
      return { token, user };
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    // {body} is destructured req.body
    login: async (parent, args) => {
      if (!args.username && !args.email) {
        throw new ApolloError ('No email or username provided');
      }

      const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
      if (!user) {
        throw new AuthenticationError ("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw new AuthenticationError ('Wrong password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    // user comes from `req.user` created in the auth middleware function
    saveBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new ApolloError ('Something went wrong');
        }
      }
      
      throw new AuthenticationError ('You need to be logged in');
    },
    // remove a book from `savedBooks`
    deleteBook: async (parent, { bookId }, context) => {

      if (context. user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new ApolloError ("Couldn't find user with this id!");
        }
        return updatedUser;
      }
      
      throw new AuthenticationError ('You need to be logged in');
    },
  }
};

module.exports = resolvers;
