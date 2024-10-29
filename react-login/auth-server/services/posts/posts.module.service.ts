import { NewPost, PostComment, SkillPost} from "./posts.module.index";
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase'; // Firebase imports
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

export class PostService {
    public async newPost(body: NewPost): Promise<number | undefined> {
        // needs to create post ID and send all info to DB
        // needs to grab the date
        // grab their username/UUID
        // const postRef = doc(db, 'posts', ACCOUNT_IDENTIFIER);
        

        //check if this user has made a post before
        // if yes, then update

        const user_id = 'INSERT_UUID_HERE';
        const postDocRef = doc(db, 'posts', user_id);
        const postDocSnapshot = await getDoc(postDocRef);


        if (postDocSnapshot.exists()) {
            // post already exists, thus update
            const postuuid = uuidv4();
            await updateDoc(doc(db, 'posts', user_id), {
                poster_uuid: user_id,
                posts: arrayUnion({
                    desireSkills: body.desireSkills,
                    haveSkills: body.haveSkills,
                    description: body.description,
                    categories: body.categories,
                    post_id: postuuid,
                    createdAt: new Date() 
                })
            });
        }
        else {
            // account has never posted before, thus create new post
            //create uuid for the post itself (identifying for commenting later)
            const postuuid = uuidv4();

            await setDoc(doc(db, 'posts', user_id), {
                poster_uuid: user_id,
                posts: [ 
                    {
                        desireSkills: body.desireSkills,
                        haveSkills: body.haveSkills,
                        description: body.description,
                        categories: body.categories,
                        post_id: postuuid,
                        createdAt: new Date() 
                    },
                ]
            });
        }

        return 0;
    }

    public async newComment(body: PostComment): Promise <number | undefined> {
        // every single comment will be added to a single document for the correct post. So each post will have a "comment" document

        return 0;
    }
    public async getLocalPosts(body: string | undefined | null): Promise <SkillPost[]> {
        // get a list of all posts from database and 
        const postsSnapshot = await getDocs(collection(db, 'posts'));
        let allPosts = new Array<SkillPost>();
        postsSnapshot.forEach((doc) => { // loop through every doc (so looping through every user who has posted something)
            const data = doc.data();
            if (data.posts && Array.isArray(data.posts)) { // if they have a valid doc, with at least one post
                for (let i = 0; i < data.posts.length; i += 1) { // loop through all posts made by a single user
                    const next_post = {
                        id: data.posts[i].post_id,
                        username: data.poster_uuid,
                        date: data.posts[i].createdAt,
                        // location:
                        skillsAsked: data.posts[i].desireSkills,
                        skillsOffered: data.posts[i].haveSkills,
                        description: data.posts[i].description,
                        categories: data.posts[i].categories
                    }
                    allPosts.push(next_post);
                }
            }
        });

        return allPosts;
    }
}