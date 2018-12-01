const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if the user is logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },
  updateItem(parent, args, ctx, info) {
    // First take a copy of the updates
    const updates = { ...args };

    // Remove the ID from the updates
    delete updates.id;

    // Run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // Find the item
    const item = await ctx.db.query.item({ where }, '{ id title }');

    // Check if the user owns the item or has the permissions to delete it
    // TODO

    // Delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    // Set the user's email to lowercase
    args.email = args.email.toLowerCase();

    // Hash the user's password
    const password = await bcrypt.hash(args.password, 10);

    // Create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );

    // Create the JWT for the user
    const token = jwt.sign({ userID: user.id }, process.env.APP_SECRET);

    // Set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    // Return the user to the browser
    return user;
  }
};

module.exports = Mutations;
