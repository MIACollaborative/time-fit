import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { DateTime } from "luxon";

class MongoDBHelper {

  constructor() { }

  static initMongoClient() {
    console.log(`${this.name} initMongoClient`);
       
    let client = new MongoClient(process.env.DATABASE_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    }
    );
    return client;
  }

  static async getDataFromTable(tableName, query={}, options={}){
    console.log(`${this.name} getDataFromTable: ${tableName}`);

    // let mFilter = {"generator.data_source_id": { $eq: "2"}, "generator.device_id": {$eq: "BBBB-9841-7093-2847"}, "timestamp": { $gte: moment(startDate).valueOf(), $lte: moment(endDate).valueOf() }};

    let resultList = [];

    let client = MongoDBHelper.initMongoClient();

    try {
      await client.connect();
      const database = await client.db("walk_to_joy").command({ ping: 1 });
      const docs = await client.db("walk_to_joy").collection(tableName);
  
  
      /*
      const query = {}; //{ runtime: { $lt: 15 } };
  
      const options = {
        //limit: 100000,
        // sort returned documents in ascending order by title (A->Z)
        //sort: { createdAt: 1 },
        // Include only the `title` and `imdb` fields in each returned document
        //projection: { _id: 0, title: 1, imdb: 1 },
      };
      */

      const cursor = docs.find(query, options);
      // print a message if no documents were found
      if ((await docs.countDocuments(query)) === 0) {
        console.log("No documents found!");
      }
      // replace console.dir with your callback to access individual elements
      await cursor.forEach((doc) => {
        resultList.push(doc);
      });
    } finally {
      await client.close();
    }
  
    console.log(`resultList.length: ${resultList.length}`);
  
    return resultList;
  }

  static async insertDocListIntoTable(collectionName, docList){
    console.log(`${this.name} insertOneDocIntoTable: ${collectionName}`);
    
    let result = undefined;

    let client = MongoDBHelper.initMongoClient();

    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("walk_to_joy").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      let created_at = DateTime.now().toJSDate();
      let updated_at = created_at;

      let timedDocList = docList.map((doc) => {
        return {
          ...doc,
          created_at,
          updated_at,
        };
      });

      const insertManyresult = await client.db("walk_to_joy").collection(collectionName).insertMany(timedDocList);

      let ids = insertManyresult.insertedIds;
      console.log(`${insertManyresult.insertedCount} documents were inserted.`);
      for (let id of Object.values(ids)) {
          console.log(`Inserted a document with id ${id}`);
      }

      result = insertManyresult;
  }
  catch (e) {
      console.log(e);
      /*
      console.log(`A MongoBulkWriteException occurred, but there are successfully processed documents.`);
      let ids = e.result.result.insertedIds;
      for (let id of Object.values(ids)) {
         console.log(`Processed a document with id ${id._id}`);
      }
      console.log(`Number of documents inserted: ${e.result.result.nInserted}`);
      */
  }
  finally {
      // Ensures that the client will close when you finish/error
      await client.close();
  }

  
    return result;
  }

  static async insertOrUpdateOneDocFromTable(tableName, doc, query, options){
    console.log(`${this.name} insertOrUpdateOneDocFromTable: ${tableName}`);
    let result = undefined;

    const existResult = await MongoDBHelper.getDataFromTable(tableName, query, {});

		if(existResult.length > 0){
			// there is an existing record
			result = await MongoDBHelper.updateOneDocFromTable("credential", query, options, true);
		}
		else{
			// new record, just insert it
			result = await MongoDBHelper.insertDocListIntoTable("credential",[doc]);
		}

    return result;
  }

  static async updateOneDocFromTable(tableName, query, options, upsert=true){
    console.log(`${this.name} updateOneDocFromTable: ${tableName}`);
    
    let result = undefined;

    let client = MongoDBHelper.initMongoClient();

    console.log(`options (before): ${options}`);

    let timedOptions = {
      ...options,
    };

    if(options.hasOwnProperty("$set")){
      let preSet = options["$set"];
      timedOptions["$set"] = {...preSet, updated_at: DateTime.now().toJSDate()};
    }
    else{
      timedOptions["$set"] = {updated_at: DateTime.now().toJSDate()};
    }

    try {
      await client.connect();
      const database = await client.db("walk_to_joy").command({ ping: 1 });
      const docs = await client.db("walk_to_joy").collection(tableName);

      result = await docs.updateOne(query, timedOptions, {upsert: upsert});
      
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
    } 
    finally {
      await client.close();
    }
  
    return result;
  }
}

module.exports = MongoDBHelper;
