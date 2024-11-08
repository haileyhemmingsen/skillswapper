import { NewPost, PostComment, SkillPost, Categories, Comment} from "./posts.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import { get } from "http";

export class PostService {
    public async newPost(body: NewPost, user_id: string): Promise<boolean | undefined> {
        // needs to create post ID and send all info to DB
        // needs to grab the date
        // grab their username/UUID
        // const postRef = doc(db, 'posts', ACCOUNT_IDENTIFIER);
        

        //check if this user has made a post before
        // if yes, then update

        // const user_id = 'INSERT_UUID_HERE';
        try {
            console.log(user_id);
            if (user_id === '') {
                return undefined;
            }
            const postDocRef = doc(db, 'posts', user_id);
            const postDocSnapshot = await getDoc(postDocRef);
            const postuuid = uuidv4();
            const post = {
                desireSkills: body.desireSkills,
                haveSkills: body.haveSkills,
                description: body.description,
                categories: body.categories,
                post_id: postuuid,
                createdAt: new Date() 
            }
            const post_string = JSON.stringify(post);

            if (postDocSnapshot.exists()) {
                // post already exists, thus update
                
                await updateDoc(doc(db, 'posts', user_id), {
                    poster_uuid: user_id,
                    posts: arrayUnion(post_string)
                });
            }
            else {
                // account has never posted before, thus create new post
                //create uuid for the post itself (identifying for commenting later)
                await setDoc(doc(db, 'posts', user_id), {
                    poster_uuid: user_id,
                    posts: [post_string]
                });
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
        

        return true;
    }

    public async newComment(body: PostComment, user_id: string): Promise <boolean | undefined> {
        // every single comment will be added to a single document for the correct post. So each post will have a "comment" document;
        try {
            const postDocRef = doc(db, 'comments', body.postID);
            const postDocSnapshot = await getDoc(postDocRef);
            const comment_uuid = uuidv4();
            const comment = {
                // postID: body.postID,
                postingUserID: user_id,
                comment: body.comment,
                comment_id: comment_uuid,
                createdAt: new Date() 
            }
            const comment_string = JSON.stringify(comment);
            if (postDocSnapshot.exists()) {
                // comments already exists for post, thus update
                await updateDoc(doc(db, 'comments', body.postID), {
                    post_uuid: body.postID,
                    comment: arrayUnion(comment_string)
                });
            } else {
                // comments do not exist for post, thus create new comment
                await setDoc(doc(db, 'comments', body.postID), {
                    post_uuid: body.postID,
                    comment: [comment_string]
                });
            }
        } catch (error) {
            console.error('Error Creating Comment: ', error);
            return false;
        }
        return true;
    }
    public async getLocalPosts(body: Categories | undefined | null): Promise <SkillPost[]> {
        // get a list of all posts from database and 
        // console.log('get local posts is called');
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        // console.log(postsSnapshot.empty);
        let allPosts = new Array<SkillPost>();

        async function getUsernameByUUID(uuid: string): Promise<string> {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uuid', '==', uuid));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();
              return `${userData.firstname} ${userData.lastname}`;
            }
            return 'Unknown User'; // Fallback if user not found
          }

          for (const doc of postsSnapshot.docs) { // Use for...of instead of forEach
            const data = doc.data(); 
            if (data.posts && Array.isArray(data.posts)) {
                for (let i = 0; i < data.posts.length; i += 1) {
                    const post_obj = JSON.parse(data.posts[i]);
                    const username = await getUsernameByUUID(data.poster_uuid); // Now you can await here
                    const next_post = {
                        id: post_obj.post_id,
                        poster_uuid: data.poster_uuid,
                        username: username, // Use the resolved username
                        date: post_obj.createdAt,
                        skillsAsked: post_obj.desireSkills,
                        skillsOffered: post_obj.haveSkills,
                        description: post_obj.description,
                        categories: post_obj.categories
                    }
                    allPosts.push(next_post);
                }
            }
        }
        // console.log(allPosts);
        return allPosts;
    }
    public async getAllComments(post_id: string | undefined): Promise <Comment[]> {
        if (post_id === undefined) {
            return [];
        }
        let allComments = new Array<Comment>();
        const commentsSnapshotRef = doc(db, 'comments', post_id);

        async function getUsernameByUUID(uuid: string): Promise<string> {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uuid', '==', uuid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                return `${userData.firstname} ${userData.lastname}`;
            }
            return 'Unknown User'; // Fallback if user not found
        }

        try {
            const commentsDocSnapshot = await getDoc(commentsSnapshotRef);
            if (commentsDocSnapshot.exists()) {
                const commentsData = commentsDocSnapshot.data();
                if (commentsData) {
                    for (let i = 0; i < commentsData.comment.length; i += 1) {
                        const post_obj = JSON.parse(commentsData.comment[i]);
                        let username = await getUsernameByUUID(post_obj.postingUserID);
                        if (username === ' ') {
                            // username dn exist. 
                            username = post_obj.postingUserID;
                        }
                        const next_comment = {
                            comment_id: post_obj.comment_id,
                            poster_id: post_obj.postingUserID,
                            poster_username: username,
                            date: post_obj.createdAt,
                            comment: post_obj.comment
                        }
                        allComments.push(next_comment);
                    }
                }
                return allComments;
            }
            return [];
        }
        catch (error) {
            console.error(error);
            return [];
        }
        
    }
}