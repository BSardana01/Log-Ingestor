const mongoose = require('mongoose');

const connectMongo = async () => {
  const connectionUri = process.env.MONGO_CONNECTION_URI;
  await mongoose.connect(connectionUri);
};

module.exports = {
  connectMongo,
};