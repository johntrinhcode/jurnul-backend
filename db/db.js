const mongoose = require("mongoose");

try {
  mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
} catch (error) {
  console.log(`Unable to connection to DB: ${error}`);
}
