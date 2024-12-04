export interface NewPost {
  desireSkills: string;
  haveSkills: string;
  description: string;
  categories: string[];
}

export interface EditPost {
  id: string;
  skillsAsked: string;
  skillsOffered: string;
  description: string;
  categories: string[];
}

export interface PostComment {
  postID: string;
  comment: string;
}

export interface SkillPost {
  id: string;
  poster_uuid: string;
  username: string;
  date: Date;
  location?: string;
  skillsAsked: string;
  skillsOffered: string;
  description: string;
  categories: string[];
  archive: boolean;
}

export interface Categories {
  categories: string[];
}

export interface Comment {
  comment_id: string;
  poster_id: string;
  poster_username: string;
  date: Date;
  comment: string;
}

export interface Archive {
  archive: boolean;
  postID: string;
}
