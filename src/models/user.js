const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.schema(
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
                        minSymbol: 0,
                    })
                ) {
                    throw new Error("password is too weak");
                }
            },
        },
        profile: {
            fullName: {
                type: String,
                required: true,
                trim: true,
                minLength: 6,
            },
            age: {
                type: Number,
                require: true,
                validator: (value) => {
                    if (value < 15) {
                        throw new Error("user must at least 15 year olds!");
                    }
                },
            },
            avatar: {
                type: mongoose.Types.Buffer,
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

// * toJSON
userSchema.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

	return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
