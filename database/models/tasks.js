import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    user_id: String,
});

const Tasks = mongoose.model('Tasks', tasksSchema);

export default Tasks;