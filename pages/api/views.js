import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";


export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();
    console.log('yolo')
    console.log(req.body.userId);
    if(req.method ==='POST') {
        await db.collection('users').findOne({ userId: ObjectId(req.body.userId )});
        return account;
      }
     
  }