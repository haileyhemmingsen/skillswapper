import {Request} from "express";
import {AuthService} from './authService';
import {SessionUser} from '../types/express';

// Calling the check method from AuthService
// No security name, could possibly be deleted
export function expressAuthentication(
  request: Request,
  securityName: string): Promise<SessionUser> {
    return new AuthService().check(request.headers.authorization);
}