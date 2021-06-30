import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";


export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();
    try {
    console.log('yolo')
    console.log(req.body.userId);
    if(req.method ==='POST') {
        await db.collection('users').updateOne({ userId: ObjectId(req.body.userId )}, {
            $inc: {
                viewsThisPeriod: 1,
            }
        });

      }
     res.send(200)
    } catch (err) {
      res.send(400)
    }
  }