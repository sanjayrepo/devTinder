const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sanjaypradhan:vIwutDFzQJHd4pVN@namastenode.2gy1w52.mongodb.net/devTinder"
  );
};

module.exports = connectDB

