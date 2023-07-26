const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    member: { type: Boolean, required: true },
    admin: { type: Boolean }
});

UserSchema.virtual('url').get(function () {
    return `/users/${this.id}`;
});

module.exports = mongoose.model('User', UserSchema);
