export interface NewPost {
    desireSkills: string,
    haveSkills: string,
    description: string,
    categories: string[]
}

export interface PostComment {
    postID: string,
    postingUserID: string,
    comment: string
}

export interface SkillPost {
    id: string,
    username: string,
    date: Date,
    location?: string,
    skillsAsked: string,
    skillsOffered: string,
    description: string,
    categories: string[]
}

export interface Categories {
    categories: string[]
}