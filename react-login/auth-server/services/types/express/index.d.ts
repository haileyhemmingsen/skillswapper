export type SessionUser = {
  email: string,
  name: string,
  id: string
}

// if there is a Request, and there is a user in the request,
// then that user is a SessionUser
declare global {
  namespace Express {
    export interface Request {
      user?: SessionUser;
    }
  }
}