import { NewPost, PostComment, SkillPost, Categories} from "./posts.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

export class PostService {
    public async newPost(body: NewPost, user_id: string): Promise<number | undefined> {
        // needs to create post ID and send all info to DB
        // needs to grab the date
        // grab their username/UUID
        // const postRef = doc(db, 'posts', ACCOUNT_IDENTIFIER);
        

        //check if this user has made a post before
        // if yes, then update

        // const user_id = 'INSERT_UUID_HERE';
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
        // console.log(post_string);

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

        return 0;
    }

    public async newComment(body: PostComment): Promise <number | undefined> {
        // every single comment will be added to a single document for the correct post. So each post will have a "comment" document

        return 0;
    }
    public async getLocalPosts(body: Categories | undefined | null): Promise <SkillPost[]> {
        // get a list of all posts from database and 
        // console.log('get local posts is called');
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        // console.log(postsSnapshot.empty);
        let allPosts = new Array<SkillPost>();
        postsSnapshot.forEach((doc) => { // loop through every doc (so looping through every user who has posted something)
            // console.log('we have gathered docs ')
            const data = doc.data();
            // console.log(data);
            if (data.posts && Array.isArray(data.posts)) { // if they have a valid doc, with at least one post
                for (let i = 0; i < data.posts.length; i += 1) { // loop through all posts made by a single user
                    // console.log('data.posts thing ahead:');
                    // console.log(data.posts);
                    const post_obj = JSON.parse(data.posts[i])
                    console.log(post_obj);
                    const next_post = {
                        id: post_obj.post_id,
                        username: data.poster_uuid,
                        date: post_obj.createdAt,
                        // location:
                        skillsAsked: post_obj.desireSkills,
                        skillsOffered: post_obj.haveSkills,
                        description: post_obj.description,
                        categories: post_obj.categories
                    }
                    allPosts.push(next_post);
                }
            }
        });
        console.log(allPosts);
        return allPosts;
    }
}