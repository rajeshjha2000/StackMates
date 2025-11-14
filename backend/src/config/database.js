const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:gqipIs6ERtUYukAE@namastenode.rc211ms.mongodb.net/StackMates"
  );
};

module.exports = connectDB;
