const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const options = { timestamps: true };
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('email is invalid');
        }
      },
    },
    password: {
      type: String,
      require: true,
      trim: true,
      validate: (value) => {
        if (
          !validator.isStrongPassword(value, {
            minLength: 4,
            minUppercase: 0,
            minSymbols: 0,
          })
        ) {
          throw new Error('password is too weak');
        }
      },
    },
    role: {
      type: String,
      require: true,
      default: 'member',
      validate: (value) => {
        if (!['admin', 'doctor', 'member'].includes(value)) {
          throw new Error('role must be a doctor or member');
        }
      },
    },
    profile: {
      fullname: {
        type: String,
        trim: true,
        minLength: 6,
        validator: (value) => {
          const re = new RegExp('/^[a-zA-Z]+( [a-zA-Z]+)+$/');
          if (!re.test(value.toLowerCase())) {
            throw new Error('fullname is invalid');
          }
        },
      },
      gender: {
        type: String,
        trim: true,
        validator: (value) => {
          if (!['female', 'male'].includes(value)) {
            throw new Error('gender is invalid, male or female is required');
          }
        },
      },
      age: {
        type: Number,
        validator: (value) => {
          if (value < 15) {
            throw new Error('user must at least 15 year olds');
          }
        },
      },
      phone: {
        type: String,
        trim: true,
        validator: (value) => {
          const re = new RegExp('/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/');
          if (!re.test(value)) {
            throw new Error('phone is invalid');
          }
        },
      },
      address: {
        type: String,
        trim: true,
      },
      avatar: {
        type: Buffer,
      },
    },
    specializations: [{ type: String }],
    background: [
      {
        figure: {
          type: Buffer,
        },
        description: {
          type: String,
          trim: true
        }
      }
    ],
    token: {
      type: String,
      trim: true,
      required: true,
    },
  },
  options
);

// #region methods

// * toJSON
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;
    const token = jwt.sign(
      { _id: user._id.toString(), role: user.role },
      env.SECRET,
      {
        expiresIn: '60 days',
      }
    );

    user.token = token;

    await user.save();

    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

//#endregion

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error('user not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('wrong password');
  }

  return user;
};

// * pre handler
// hash plaintext password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
