const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/sequelize');

class User extends Model {
  // Instance method to validate password
  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Custom toJSON to exclude password
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'Username already exists',
      },
      validate: {
        notEmpty: {
          msg: 'Username cannot be empty',
        },
        len: {
          args: [3, 255],
          msg: 'Username must be between 3 and 255 characters',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      // Hash password before creating user
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      // Hash password before updating user
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

// Static methods for compatibility with existing controllers
User.create = async function (username, password) {
  const user = await Model.build.call(User, { username, password }).save();
  return {
    id: user.id,
    username: user.username,
    createdAt: user.created_at,
  };
};

User.findByUsername = async function (username) {
  return await Model.findOne.call(User, { where: { username } });
};

User.exists = async function (username) {
  const count = await Model.count.call(User, { where: { username } });
  return count > 0;
};

User.getAll = async function () {
  const users = await Model.findAll.call(User, {
    attributes: ['id', 'username', 'created_at'],
    order: [['created_at', 'DESC']],
  });
  return users.map(user => ({
    id: user.id,
    username: user.username,
    createdAt: user.created_at,
  }));
};

// Keep validatePassword as static method for compatibility
User.validatePassword = async function (user, password) {
  if (!user) return false;
  return await user.validatePassword(password);
};

module.exports = User;
