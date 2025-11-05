const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namastedev:ECXK5j0d4OuHZhs6@namastenode.rc211ms.mongodb.net/StackMates"
  );
};

module.exports = connectDB;
