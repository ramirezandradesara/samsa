import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";
import {
  getMongoDbName,
  getReadingRoutinesCollectionName,
} from "@/lib/db/mongo-env";
import type { ReadingRoutineMongoDocument } from "@/lib/db/reading-routine-doc";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

/**
 * Una sola conexión reusada entre invocaciones (dev + entornos serverless).
 */
export function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("La variable de entorno MONGODB_URI no está definida");
  }

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri);
    globalForMongo.mongoClientPromise = client.connect();
  }
  
  return globalForMongo.mongoClientPromise;
}

export async function getReadingRoutinesCollection(): Promise<
  Collection<ReadingRoutineMongoDocument>
> {
  const client = await getMongoClientPromise();
  const db = client.db(getMongoDbName());
  return db.collection(getReadingRoutinesCollectionName());
}
