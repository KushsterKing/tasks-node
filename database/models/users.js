import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Users = mongoose.model('Users', usersSchema);

export default Users;