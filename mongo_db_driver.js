const MongoDB = require("mongodb");
const { MongoClient } = MongoDB;

const MONGO_DB_URL = 'mongodb+srv://Maxim:UqQHM77y2vbUhake@cluster0-ipgdx.mongodb.net/db-contacts?retryWrites=true&w=majority'
const  DB_NAME = "db-contacts";

async function main(){
    const client = await MongoClient.connect(MONGO_DB_URL);
    const db = client.db(DB_NAME);

    const contacts = await db.createCollection("contacts");

    await contacts.insertOne({
        "name": "ooph"
    })
}

main();