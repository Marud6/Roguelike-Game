import { MongoClient, ObjectId } from "mongodb";

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
    throw new Error("MONGO_URL environment variable is required");
}

let client = null;
let db = null;

export async function connect() {
    if (db) return db;
    client = await MongoClient.connect(mongoUrl);
    db = client.db();
    console.log("Connected to MongoDB");
    return db;
}

export async function close() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log("MongoDB connection closed");
    }
}

export async function deleteLevels(id) {
    const database = await connect();
    const queue = [id];
    const visited = new Set();

    while (queue.length > 0) {
        const currentId = queue.shift();
        if (!currentId || visited.has(currentId.toString())) continue;
        visited.add(currentId.toString());

        try {
            const level = await database
                .collection("levels")
                .findOne({ _id: new ObjectId(currentId) });
            if (!level) continue;

            if (level.right) queue.push(level.right);
            if (level.left) queue.push(level.left);

            await database
                .collection("levels")
                .deleteOne({ _id: new ObjectId(currentId) });
        } catch (err) {
            console.error("deleteLevels error for id:", currentId, err);
        }
    }
}

export async function saveLevel(levelData) {
    const database = await connect();
    const id = levelData._id ? new ObjectId(levelData._id) : new ObjectId();
    levelData._id = id;

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
        return await database
            .collection("levels")
            .findOne({ _id: new ObjectId(id) });
    } catch (err) {
        console.error("getLevelById error:", err);
        return null;
    }
}
