import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import "dotenv/config";
const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationError: true,
  },
});

export async function register(username, password) {
  try {
    await connect();
    const res = await client

      .db("commerce")
      .collection("users")
      .insertOne({ username, password });
    return [true, res.insertedId];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function roles() {
  try {
    await connect();
    const res = await client
      .db("commerce")
      .collection("roles")
      .find()
      .toArray();

    return res;
  } finally {
    await close();
  }
}

export async function login(username) {
  try {
    await connect();
    const res = await client
      .db("commerce")
      .collection("users")
      .findOne({ username });
    return [res != null, res];
  } finally {
    await close();
  }
}

export async function getAllProducts() {
  try {
    await connect();
    const res = await client
      .db("commerce")
      .collection("products")
      .find()
      .toArray();
    return [true, res];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function updateProduct(product) {
  try {
    await connect();
    const result = await client
      .db("commerce")
      .collection("products")
      .updateOne({ name: "products" }, { $set: product[0] });
    return [true, result.modifiedCount];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function getAllTrolley() {
  try {
    await connect();
    const res = await client
      .db("commerce")
      .collection("trolley")
      .find()
      .toArray();
    return [true, res];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function getTrolley(user) {
  try {
    await connect();
    const res = await client
      .db("commerce")
      .collection("trolley")
      .findOne({ user });

    return [res !== null, res];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function updateProductTrolley(product) {
  try {
    await connect();
    const result = await client
      .db("commerce")
      .collection("trolley")
      .updateOne({ user: product.user }, { $set: product });
    return [true, result.modifiedCount];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function addProductTrolley(product) {
  try {
    await connect();
    const result = await client
      .db("commerce")
      .collection("trolley")
      .insertOne({
        user: product.user,
        products: [
          {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,

            url: product.url,
          },
        ],
      });
    return [true, result.insertedId];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function deleteProductsTrolley(user) {
  try {
    await connect();
    const result = await client
      .db("commerce")
      .collection("trolley")
      .deleteOne({ user });
    return [true, result.deletedCount];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function getAllReviews() {
  try {
    await connect();
    const res = await client
      .db("commerce")
      .collection("reviews")
      .find()
      .toArray();
    return [res != null, res];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function addReview(review) {
  try {
    await connect();
    const result = await client
      .db("commerce")
      .collection("reviews")
      .insertOne(review);
    return [true, result.insertedId];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

export async function deleteReview(id) {
  try {
    await connect();
    const result = await client
      .db("commerce")
      .collection("reviews")
      .deleteOne({ _id: new ObjectId(id) });
    return [true, result.deletedCount];
  } catch (err) {
    console.log(err);
    return [false, err];
  } finally {
    await close();
  }
}

export async function updateReviews(id, comment) {
  try {
    await connect();
    const result = await client
      .db("commerce")
      .collection("reviews")
      .updateOne({ _id: new ObjectId(id) }, { $set: comment });

    return [true, result.modifiedCount];
  } catch (err) {
    return [false, err];
  } finally {
    await close();
  }
}

async function connect() {
  await client.connect();
}

async function close() {
  await client.close();
}
