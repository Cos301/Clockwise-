import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { IComment, IPost } from '@mp/api/posts/util';

@Injectable()
export class PostsRepository {
  //Fetch all posts from the database
  async fetchAllPosts(): Promise<IPost[]> {
    console.log('Fetch all posts');
  
    const postsRef = admin.firestore().collectionGroup('posts');
    const posts: IPost[] = [];
  
    const snapshot = await postsRef.get();
  
    const postPromises = snapshot.docs.map(async (doc) => {
      const post = doc.data() as IPost;
      const comments: IComment[] = [];
  
      await Promise.all(post.comments.map(async (comment) => {
        const commentRef: any = comment;
        const comment_id = commentRef._path.segments[1];
        const newcomment = await admin.firestore().collection('comments').doc(comment_id).get().then(async (doc) => {
          const commentData = doc.data() as IComment;
          const newComment: IComment = {
            comment_id: commentData.comment_id,
            text: commentData.text,
            time_created: commentData.time_created,
            user_id: commentData.user_id,
            comment_children: commentData.comment_children,
          };
          console.log('Francois -test', newComment);
          return newComment;
        });
        comments.push(newcomment);
      }));
  
      const newPost: IPost = {
        post_id: post.post_id,
        caption: post.caption,
        comments: await Promise.all(comments),
        img_url: post.img_url,
        time_created: post.time_created,
        time_remove: post.time_remove,
        user_id: post.user_id,
      };
  
      console.log('newPost:', newPost);
      posts.push(newPost);
    });
  
    await Promise.all(postPromises);
  
    console.log('posts.repository.ts:29 ~ posts:', posts);
    return posts;
  }
  
  

  async createPost(post: IPost) {
    return await admin
      .firestore()
      .collection('posts')
      .doc(post.post_id)
      .create(post);
  }
}
