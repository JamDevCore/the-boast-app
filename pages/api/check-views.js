import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";
import {getPlanLimits} from '../../utils/get-plan';

export default async function handler(req, res) {

    const { body } = req;
    const { db  }= await connectToDatabase();
    if(req.method ==='GET') {
        const users = db.collection('users').find();
        users.forEach(async user => {
            if(user.plan) {
                const views = user.viewsThisPeriod;
                const totalViews = getPlanLimits(user.plan);
                const date1 = new Date(user.subscriptionPeriodStart);
                const date2 = new Date();
                console.log(date1.getFullYear(), date1.getMonth()+1, 1)
                const date3 = new Date(date1.getFullYear(), date1.getMonth()+1, 1);
                if(date2 > date3) {
                    await db.collection('users').updateOne({ _id: ObjectId(user._id) }, {
                        $set: {
                            subscriptionPeriodStart: new Date(),
                        }
                    });
                }
            }
        })
      }
      res.send(200);
     
  }