export interface NewPost {
    desireSkills: string,
    haveSkills: string,
    description: string
}

export interface PostComment {
    postID: string,
    postingUserID: string,
    comment: string
}

