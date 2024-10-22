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

export interface SkillPost {
    id: number,
    username: string,
    date: Date,
    location?: string,
    skillsAsked: string,
    skillsOffered: string,
    description: string,
}