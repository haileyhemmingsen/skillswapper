// Purpose: Define interfaces for the auth service.
// User is an interface that defines the shape of a user object.
// Credentials is an interface that defines what is essentially a login object.
// Authenticated is an interface that defines all info related to a SessionUser

export interface User {
  email: string;
  name: string;
  id: string;
}

export interface Credentials {
  email: string;
  password: string;
}

// Session User is defined in the exprss index.d.ts file
export interface Authenticated {
  name: string;
  accessToken: string;
  id: string;
}
