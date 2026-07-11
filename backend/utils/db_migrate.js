const { MongoClient } = require('mongodb');

const SOURCE_URI = 'mongodb+srv://yesaswim2006_db_user:Ku3GnT7VIfUUGU8u@interndb.tkawrlv.mongodb.net/InternLink?retryWrites=true&w=majority';
const DEST_URI = 'mongodb+srv://yesaswim2006_db_user:0pH36096zKU9jmaQ@interndb.scbiasf.mongodb.net/InternLink?retryWrites=true&w=majority';

async function migrate() {
  console.log('Connecting to SOURCE database:');
  console.log(' -> ' + SOURCE_URI.replace(/:([^@]+)@/, ':****@'));
  const sourceClient = await MongoClient.connect(SOURCE_URI);
  const sourceDb = sourceClient.db('InternLink');

  console.log('Connecting to DESTINATION database:');
  console.log(' -> ' + DEST_URI.replace(/:([^@]+)@/, ':****@'));
  const destClient = await MongoClient.connect(DEST_URI);
  const destDb = destClient.db('InternLink');

  console.log('\nFetching collections from source...');
  const collections = await sourceDb.listCollections().toArray();

  for (const collectionInfo of collections) {
    const colName = collectionInfo.name;
    // Skip MongoDB system indexes/metadata collections
    if (colName.startsWith('system.')) continue;

    console.log(`\n----------------------------------------`);
    console.log(`Migrating collection: "${colName}"`);
    const sourceCol = sourceDb.collection(colName);
    const destCol = destDb.collection(colName);

    // Fetch all documents from source
    const documents = await sourceCol.find({}).toArray();
    console.log(` -> Found ${documents.length} documents in source.`);

    if (documents.length > 0) {
      console.log(` -> Cleaning destination collection "${colName}"...`);
      await destCol.deleteMany({});
      
      console.log(` -> Copying documents...`);
      const result = await destCol.insertMany(documents);
      console.log(` -> Successfully copied ${result.insertedCount} documents.`);
    } else {
      console.log(` -> Source collection is empty. Ensuring creation at destination...`);
      try {
        await destDb.createCollection(colName);
      } catch (e) {
        // Collection already exists at destination, ignore
      }
    }
  }

  console.log('\n========================================');
  console.log('🎉 Data migration completed successfully!');
  console.log('========================================');

  await sourceClient.close();
  await destClient.close();
}

migrate().catch(err => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
