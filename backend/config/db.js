const mongoose = require('mongoose');

<<<<<<< HEAD
let isConnected = false;
let dbError = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    const errorMsg = 'MONGO_URI is missing from environment variables!';
    console.error(`❌ Database Error: ${errorMsg}`);
    dbError = new Error(errorMsg);
    return;
  }

  try {
    // Set 10-second timeout for server selection in production
    const options = {
      serverSelectionTimeoutMS: 10000,
    };

    const conn = await mongoose.connect(mongoUri, options);
    isConnected = true;
    dbError = null;
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    dbError = error;
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error(
      '💡 Troubleshooting Tip: Please ensure your MongoDB Atlas cluster allows access from your current IP. For cloud hosting (like Railway), you must whitelist "0.0.0.0/0" (allow access from anywhere) in MongoDB Atlas IP Access List.'
    );
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  error: dbError ? dbError.message : null,
  tip: dbError ? 'Ensure that 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access and the MONGO_URI username/password are correct.' : null
});

module.exports = { connectDB, getDBStatus };
=======
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/internship_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
>>>>>>> 5ad54ac356437c46391d42f18547dd0a7250531b
