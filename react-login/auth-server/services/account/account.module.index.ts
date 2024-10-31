//exporting data transfer object (interface)

import e from "express"

export interface SignUpCredentials {
    firstname?: string,
    lastname?: string,
    email: string,
    password: string,
    zip?: string
}

export interface DatabaseCredentials {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    createdAt: Date,
    uuid: string
}

export interface Authenticated { 
    id: string,
    accessToken: string
}

export interface UpdatePassword {
    email: string,
    oldPass: string,
    newPass: string
}

export interface UpdateEmail {
    oldEmail: string,
    newEmail: string,
    password: string
}

export interface UpdateUsername {
    oldUsername: string,
    newUsername: string,
    password: string
}