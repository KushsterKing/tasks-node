import mongoose from 'mongoose';

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

export default mongoose;