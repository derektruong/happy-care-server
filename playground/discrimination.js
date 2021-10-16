// const mongoose = require("mongoose");

// const options = {
//     timestamps: {
//         createdAt: "created",
//         updatedAt: "updated",
//     },
//     discriminatorKey: "userType",
//     id: false,
//     toJSON: {
//         getters: true,
//         virtuals: true,
//     },
//     toObject: {
//         getters: true,
//         virtuals: true,
//     },
// };
// const userSchema = mongoose.Schema(
//     {
//         email: {
//             type: String,
//         },
//         password: {
//             type: String,
//         },
//     },
//     options
// );

// const memberSchema = mongoose.Schema({
//     tag: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
// });

// const doctorSchema = mongoose.Schema({
// 	specialist: [{ type: mongoose.Types.ObjectId, ref: "Specialist"}],
// });
