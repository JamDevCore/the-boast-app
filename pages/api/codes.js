import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";


export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();
    if(req.method ==='GET') {
        const userId = body.userId
        console.log(userId)
        const account = await db.collection('users').findOne({ _id: ObjectId(userId )});
        const vouchers = await db.collection('vouchers').find({ userId: userId.toString()  })
        console.log('vouchers', vouchers)
        res.send(vouchers)
      }
      if(req.method ==='POST') {
          const { userId, voucher } = body;
        if(voucher) {
            const existingVoucher = await db.collection('vouchers').findOne({ code: voucher });
            console.log('le vouchair', existingVoucher)
            if(!existingVoucher) {
                throw new Error('No voucher exists')
            } else {
                if(existingVoucher.isRedeemed) {
                    throw new Error('is redeemed')
                }
        await db.collection('users').updateOne({ _id: ObjectId(userId )}, {
                    $addToSet: {
                        vouchers: voucher,
                    }
                })
                await db.collection('vouchers').updateOne({ code: voucher}, {
                    $set: {
                        userId: userId,
                        isRedeemed: true,
                    }
                })
                res.send('Success');
            }
        }

      }
  }