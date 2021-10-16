const User = require("../models/user");

const createUser = async (req, res) => {
    const user = User(req.body);
    try {
        const token = await user.generateAuthToken();
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateAuthToken();

        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const user = res.user;

        user.tokens = user.tokens.filter(
            (userToken) => userToken.token !== res.token
        );

        await user.save();

        res.json({ message: "logged out successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserInfo = async (req, res) => {
    try {
        res.json(res.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserInfoById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdate = ["email", "password", "profile"];

        const isValidOperator = updates.every((update) =>
            allowedUpdate.includes(update)
        );

        if (!isValidOperator) {
            return res
                .status(400)
                .json({ error: "you cannot update with these fields" });
        }

        updates.forEach((update) => {
            res.user[update] = req.body[update];
        });

        await res.user.save();

        res.json(res.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: "deleted user successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// * exports
module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getUserInfo,
    getUserInfoById,
    updateUser,
	deleteUser,
};
