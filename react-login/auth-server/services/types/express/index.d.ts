export type SessionUser = {
  email: string,
  name: string,
  id: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: SessionUser;
    }
  }
}