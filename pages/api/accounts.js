import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";


export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();
    console.log('yolo')
    if(req.method ==='GET') {
        const account = await db.collection('accounts').findOne({ userId: ObjectId(userId )});
        return account;
      }
     
  }