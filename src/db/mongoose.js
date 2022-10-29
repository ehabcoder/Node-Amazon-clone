const mongoose = require('mongoose');
main().catch(err => console.log(err.message));
async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
}