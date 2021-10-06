const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: (value) => {
                if (!validator.isEmail(value)) {
                    throw new Error("email is invalid");
                }
            },
        },
        password: {
            type: String,
            require: true,
            unique: true,
            trim: true,
            minLength: 6,
            validate: (value) => {
                if (
                    !validator.isStrongPassword(value, {
                        minUppercase: 0,
                        minSymbols: 0,
                    })
                ) {
                    throw new Error("password is too weak");
                }
            },
        },
        role: {
            type: String,
            default: "member",
            validate: (value) => {
                if (!["member", "doctor"].includes(value)) {
                    throw new Error("role must be a member or doctor");
                }
            },
        },
        profile: {
            fullName: {
                type: String,
                default: "Nguyen Van A",
                required: true,
                trim: true,
                minLength: 6,
            },
            age: {
                type: Number,
                default: 15,
                require: true,
                validator: (value) => {
                    if (value < 15) {
                        throw new Error("user must at least 15 year olds!");
                    }
                },
            },
            avatar: {
                type: Buffer,
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    require: true,
                },
            },
        ],
    },
    {
        timestamp: true,
    }
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
        const token = jwt.sign({ _id: user._id.toString() }, env.SECRET, {
            expiresIn: "30 days",
        });

        user.tokens = user.tokens.concat({ token });

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
        throw new Error("user not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("wrong password");
    }

    return user;
};

// * pre handler
// hash plaintext password before saving
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
