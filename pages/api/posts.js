import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "bson";


const deletePost = async (post, db, res) => {
  await db.collection('posts').deleteOne({ _id: ObjectId(post) });
  res.send('complete');
}

export default async function handler(req, res) {
    const { body } = req;
    const { db  }= await connectToDatabase();
    console.log('POST', req.body)
    if(req.method ==='DELETE') {
      const { post } = body;
      if(post) {
        await deletePost(post, db, res);
      }
    }
    if (req.method === 'POST') {

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
            hearts: 0,
            responses: 0,
            type: post.type,
            questionStyle: post.questionStyle || null,
            options: post.options.map(op => {
              return { label: op, _id: new ObjectId(), score: 0, responses: 0 };
            }),
        });
        res.send('complete')
        } else {
            throw new Error('No data received');
        }
    } else if (req.method === 'PUT') {
      const { post, option, status } = req.body;
      console.log(post, option, status)
      if(status === 'updatePost') {
        const oldPost = await db.collection('posts').findOne({ _id: ObjectId(post._id) })
        const newPost = JSON.parse(JSON.stringify(oldPost));
        console.log('oldPost', oldPost)
        console.log('newPost', newPost)

        newPost.title = post.title
        newPost.text = post.text;
        newPost.link = post.link;
        newPost.type = post.type;
        newPost.questionStyle = post.questionStyle;
        newPost.options = post.options;
        // newPost.options = newPost.options.map(op => {
        //   const newOP = JSON.parse(JSON.stringify(op));
        //   const option = oldPost.options.filter(o => o._id === op._id)[0];
        //   newOp.label = 
        //   console.log(option)
        // })
        await db.collection('posts')
        .updateOne({
                _id: ObjectId(post._id)
            }, {
              $set: {
                options: newPost.options,
                title: newPost.title,
                text: newPost.text,
                link: newPost.link,
                type: newPost.type,
                questionStyle: newPost.questionStyle,
              },
            });
         
      } else if(option) {
        const oldPost = await db.collection('posts').findOne({ _id: ObjectId(post) })
        const newPost = JSON.parse(JSON.stringify(oldPost))
        const newOptions = oldPost.options.map(op => {
          if(op._id.toString() === option) {
            console.log('here')
            const newOp = JSON.parse(JSON.stringify(op));
            newOp.score += 1;
            newOp.responses += 1;
            console.log('new', newOp);
            return newOp;
          }
          return op;
        })
        console.log(newOptions)
        await db.collection('posts')
        .updateOne({
                _id: ObjectId(post)
            }, {
              $set: {
                options: newOptions
              },
              $inc: {
                responses: 1,
              }
            });
            res.send('complete')
        } else if(body.isLike) {
          const result = await db.collection('posts')
          .updateOne({
                  _id: ObjectId(post)
              }, {
                $inc: {
                  hearts: 1,
                }
              });
              res.send('complete')
        }
        else {
            throw new Error('No data received');
        } 
    }
  }