import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";

export default async function handler(req, res) {
    const { body } = req;
    console.log(body, body.post)
    console.log(req.method)
    if (req.method === 'POST') {
      const { db  }= await connectToDatabase();
      const { post } = body;
      console.log('post', post)
      if(post) {
        await db.collection('posts')
        .insertOne({
            userId: ObjectId(post.userId),
            title: post.title,
            link: post.link,
            text: post.text,
            date: new Date(),
            responses: 0,
            type: post.type,
            questionStyle: post.questionStyle || null,
            options: post.options.map(op => {
              return { label: op, _id: new ObjectId(), score: 0, responses: 0 };
            }),
        });
        } else {
            throw new Error('No data received');
        }
      res.send('complete')
    } else {
      // Handle any other HTTP method
    }
  }