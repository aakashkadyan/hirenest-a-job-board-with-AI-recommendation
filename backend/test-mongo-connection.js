const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// Print the MongoDB URI for verification (with password masked)
const maskedUri = process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//******:******@');
console.log("Attempting to connect to MongoDB:", maskedUri);

// Create a test connection to MongoDB Atlas
async function testMongoDBConnection() {
  // Approach 1: Standard connection with MongoClient
  try {
    console.log("\nApproach 1: Standard MongoClient connection");
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");
    await client.db("admin").command({ ping: 1 });
    console.log("Ping command successful!");
    await client.close();
    console.log("Connection closed");
  } catch (err) {
    console.error("Approach 1 Failed:", err.message);
  }

  // Approach 2: With explicit API version
  try {
    console.log("\nApproach 2: With explicit API version");
    const client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");
    await client.close();
  } catch (err) {
    console.error("Approach 2 Failed:", err.message);
  }

  // Approach 3: With SSL settings
  try {
    console.log("\nApproach 3: With SSL settings");
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const client = new MongoClient(process.env.MONGO_URI, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");
    await client.close();
  } catch (err) {
    console.error("Approach 3 Failed:", err.message);
  }

  // Approach 4: Convert SRV URI to standard URI
  try {
    console.log("\nApproach 4: Converting SRV URI to standard URI");
    // Extract parts from the SRV URI
    const uri = process.env.MONGO_URI;
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)(\?.*)?/);
    
    if (match) {
      const [_, username, password, host, database, queryParams] = match;
      // Convert to standard URI format with explicit ports
      const standardUri = `mongodb://${username}:${password}@${host.replace(/\./g, '-')}:27017/${database}${queryParams || ''}`;
      console.log("Converted URI:", standardUri.replace(/\/\/([^:]+):([^@]+)@/, '//******:******@'));
      
      const client = new MongoClient(standardUri, {
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true,
      });
      await client.connect();
      console.log("Connected successfully to MongoDB Atlas!");
      await client.close();
    } else {
      console.error("Could not parse SRV URI");
    }
  } catch (err) {
    console.error("Approach 4 Failed:", err.message);
  }

  console.log("\nFinished testing all connection methods");
}

testMongoDBConnection().catch(console.error); 