import { MongoClient, ObjectId } from "mongodb";

const mongoUrl = process.env.MONGO_URL ||   "mongodb://admin:s6CrJ6b8QijbGGYl23EKrejgnUtA@localhost:27017/gameDB?authSource=admin";
let db = null;
export async function connect() {
    if (db) return db;
    const client = await MongoClient.connect(mongoUrl);
    db = client.db();
    console.log("✅ Connected to MongoDB");
    return db;
}


export async function deleteLevels(id) {
    const database = await connect();
    try {
       const level=await database.collection("levels").findOne({ _id: new ObjectId(id) });
        if(!level) return;
        const right=level.right
        const left=level.left
        await database.collection("levels").deleteOne({ _id: new ObjectId(id) });
        if(right){
            await deleteLevels(right);
        }
        if(left){
            await deleteLevels(left);
        }
    } catch (err) {
        console.error("getLevelById error:", err);
        return null;
    }

}


export async function saveLevel(levelData) {
    const database = await connect();
    // Ensure we have an _id
    const id = levelData._id ? new ObjectId(levelData._id) : new ObjectId();
    levelData._id = id;

    // Upsert document
    await database.collection("levels").updateOne(
        { _id: id },
        { $set: levelData },
        { upsert: true }
    );

    return id.toString();
}

export async function getLevelById(id) {
    const database = await connect();
    try {
        return await database.collection("levels").findOne({ _id: new ObjectId(id) });
    } catch (err) {
        console.error("getLevelById error:", err);
        return null;
    }
}
