import { NewPost, PostComment, SkillPost, Categories, Comment, Archive, EditPost } from "./posts.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import { get } from "http";

export class PostService {
    public async newPost(body: NewPost, user_id: string): Promise<string | undefined> {
        // needs to create post ID and send all info to DB
        // needs to grab the date
        // grab their username/UUID
        // const postRef = doc(db, 'posts', ACCOUNT_IDENTIFIER);
        

        //check if this user has made a post before
        // if yes, then update

        // const user_id = 'INSERT_UUID_HERE';
        try {
            // console.log(user_id);
            // The middleware will throw an error before it even reaches this part of the function
            // if (user_id === '') {
            //     return undefined;
            // }
            const postDocRef = doc(db, 'posts', user_id);
            const postDocSnapshot = await getDoc(postDocRef);
            const postuuid = uuidv4();
            const post = {
                archive: false,
                desireSkills: body.desireSkills,
                haveSkills: body.haveSkills,
                description: body.description,
                categories: body.categories,
                post_id: postuuid,
                createdAt: new Date()
            }
            const post_string = JSON.stringify(post);
            if (postDocSnapshot.exists()) {
                // console.log('Post already exists');
                // post already exists, thus update
                
                await updateDoc(doc(db, 'posts', user_id), {
                    poster_uuid: user_id,
                    posts: arrayUnion(post_string)
                });
            }
            else {
                // account has never posted before, thus create new post
                //create uuid for the post itself (identifying for commenting later)
                // console.log('never posted before');
                await setDoc(doc(db, 'posts', user_id), {
                    poster_uuid: user_id,
                    posts: [post_string]
                });
            }
            return postuuid;
        }
        catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public async editPost(body: EditPost, user_id: string): Promise <boolean | undefined> {
        const postDocRef = doc(db, 'posts', user_id);
        try {
            const postDocSnapshot = await getDoc(postDocRef);
            if(postDocSnapshot.exists()) {
                const postData = postDocSnapshot.data();

                if (postData.poster_uuid === user_id) {
                    let found = false;
                    for (let i =0; i < postData.posts.length; i += 1) {
                        let cur_post = JSON.parse(postData.posts[i]);
                        if (cur_post.post_id === body.id) {
                            // post has been found
                            found = true;
                            // update relevant info
                            cur_post.skillsAsked = body.skillsAsked;
                            cur_post.skillsOffered = body.skillsOffered;
                            cur_post.description = body.description;
                            cur_post.categories = body.categories;

                            cur_post = JSON.stringify(cur_post);
                            postData.posts[i] = cur_post;
                            // console.log(postData)
                            await updateDoc(postDocRef, postData);
                            break;
                        }
                    }
                    if (found === false) {
                        console.log('Post does not exist');
                        return false;
                    }
                }
                else {
                    // user is not creator of these posts
                    console.log('Incorrect and invalid user attempting to update this post');
                    return undefined;
                }
            }
            else {
                console.log('User has no posts');
                return false;
                // throw new Error('Post does not exist')
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }


    public async getUserPosts(user_id: string): Promise<SkillPost[]> {
        const postDocRef = doc(db, 'posts', user_id);
        let allPosts = new Array<SkillPost>();
        
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uuid', '==', user_id));
            const userSnapshot = await getDocs(q);
            if (userSnapshot.empty) {
                console.log('User not found');
                return [];
            }


            const userDoc = userSnapshot.docs[0];
            const userData = userDoc.data();
            let username = `${userData.firstname} ${userData.lastname}`;
            if (username === ' ') {
                // first name does not exist, thus last name does not exist, thus username should be uuid
                username = user_id
            }
            // we are looking at our own posts, getting zip is unnecessary
            // const userZip = userData.zip;


            const postDocSnapshot = await getDoc(postDocRef);
            if(postDocSnapshot.exists()) {
                const postData = postDocSnapshot.data();
                if (postData.poster_uuid === user_id) {
                    for (let i = 0; i < postData.posts.length; i += 1) {
                        const cur_post = JSON.parse(postData.posts[i]);
                        
                        const next_post = {
                            id: cur_post.post_id,
                            poster_uuid: postData.poster_uuid,
                            username: username, // Use the resolved username
                            date: cur_post.createdAt,
                            skillsAsked: cur_post.desireSkills,
                            skillsOffered: cur_post.haveSkills,
                            description: cur_post.description,
                            categories: cur_post.categories,
                            archive: cur_post.archive 
                        }
                        allPosts.push(next_post);        
                    }
                }
                else {
                    // user is not creator of these posts
                    console.log('Incorrect and invalid user attempting to read these posts');
                    return [];
                }
            }
            else {
                console.log('User has no posts');
                return [];
            }
        }
        catch (error) {
            console.error(error);
            return [];
        }
        return allPosts;
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
        let categories_exist = false;
        if(!!body) {
            if (body?.categories.length !== 0) {
                categories_exist = true;
            }
        }
        async function getUsernameByUUID(uuid: string): Promise<[string, string | undefined]> {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('uuid', '==', uuid));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();
              const zip = userData.zip;
              let username = `${userData.firstname} ${userData.lastname}`
              if (username === ' ') {
                // first name does not exist, thus last name does not exist, thus username should be uuid
                username = uuid
              }
              return [username, zip];
            }
            return ['Unknown User', undefined]; // Fallback if user not found
          }

          for (const doc of postsSnapshot.docs) { // Use for...of instead of forEach
            const data = doc.data(); 
            if (data.posts && Array.isArray(data.posts)) {
                for (let i = 0; i < data.posts.length; i += 1) {
                    const post_obj = JSON.parse(data.posts[i]);
                    // if categories_exist: check to ensure that all categories in the doc also exist in list of categories with this post

                    if (!post_obj.archive) {
                        const [username, zip] = await getUsernameByUUID(data.poster_uuid); // Now you can await here
                        const next_post = {
                            id: post_obj.post_id,
                            poster_uuid: data.poster_uuid,
                            username: username, // Use the resolved username
                            date: post_obj.createdAt,
                            skillsAsked: post_obj.desireSkills,
                            skillsOffered: post_obj.haveSkills,
                            description: post_obj.description,
                            categories: post_obj.categories,
                            archive: post_obj.archive,
                            location: zip
                        }
                        allPosts.push(next_post);
                    }
                    
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

    public async archiveStatusUpdate(archive: Archive, user_id: string): Promise <boolean | undefined> {
        const postDocRef = doc(db, 'posts', user_id);
        try {
            const postDocSnapshot = await getDoc(postDocRef);
            if(postDocSnapshot.exists()) {
                const postData = postDocSnapshot.data();

                if (postData.poster_uuid === user_id) {
                    let found = false;
                    for (let i =0; i < postData.posts.length; i += 1) {
                        const cur_post = JSON.parse(postData.posts[i]);
                        if (cur_post.post_id === archive.postID) {
                            // post has been found
                            found = true;
                            cur_post.archive = archive.archive;
                            const return_post = JSON.stringify(cur_post);
                            postData.posts[i] = return_post;
                            await updateDoc(postDocRef, postData);
                            break;
                        }
                    }
                    if (found === false) {
                        console.log('Post does not exist');
                        return false;
                    }
                }
                else {
                    // user is not creator of these posts
                    console.log('Incorrect and invalid user attempting to update this post');
                    return undefined;
                }
            }
            else {
                console.log('User has no posts');
                return false;
                // throw new Error('Post does not exist')
            }
            
        }
        catch (error) {
            console.error(error);
            return false;
        }
            
        // find post
        // if post doesnt exist, return false
        // check if post belongs to this poster
        // if yes update
        // if no, return undefined
        
        //if update fails, return false
        // if update succeeds, return true
        return true;
    }


}