import {
  Body,
  Query,
  Controller,
  Post,
  Get,
  Response,
  Route,
  SuccessResponse,
  Security,
  TsoaResponse,
  Res,
} from 'tsoa';
import { Request, Response as ExpressResponse } from 'express';
import { LoginService } from './account.module.service';
import {
  SignUpCredentials,
  UpdatePassword,
  UpdateEmail,
  UpdateUsername,
  Authenticated,
} from './account.module.index';

/**
 * Route for signup
 * Returns 201 on created account and 409 if account already exists
 * Returns as a boolean, true/false if the account was create
 * Also don't need the security decorator because this isn't a secure route */
@Route('signup')
export class SignUpController extends Controller {
  @Post()
  @Response('409', 'Already Exists')
  @SuccessResponse('201', 'Created')
  public async signup(
    @Body() body: SignUpCredentials
  ): Promise<boolean | undefined> {
    return new LoginService()
      .signup(body)
      .then(
        async (created: boolean | undefined): Promise<boolean | undefined> => {
          if (!created) {
            this.setStatus(409);
          }
          return created;
        }
      );
  }
}

@Route('login')
export class LogInController extends Controller {
  @Post()
  @Response('401', 'Invalid Username or Password')
  @SuccessResponse('200', 'Logged In')
  public async login(
    @Body() body: SignUpCredentials,
    @Res() setCookieResponse: TsoaResponse<200 | 401, Authenticated | undefined> // Use Response to define cookie and valid
  ): Promise<Authenticated | undefined> {
    return new LoginService()
      .login(body)
      .then((valid: Authenticated | undefined): Authenticated | undefined => {
        if (!valid) {
          // Return a 401 response with a message
          // No message as of now, @Response is redundant for now
          // Need to define message explicitly in the Tsoa Response above
          // for there to be a message
          return setCookieResponse(401, valid);
        }

        // Set the access token in a cookie with the `Set-Cookie` header
        setCookieResponse(200, valid, {
          'Set-Cookie': `accessToken=${valid.accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
        });
        return valid;
      });
  }
}

@Route('changePassword')
@Security('jwt')
export class PasswordController extends Controller {
  @Post()
  @Response('500', 'Failed to change password')
  @SuccessResponse('200', 'Password changed')
  public async changePassword(
    @Body() body: UpdatePassword
  ): Promise<boolean | undefined> {
    return new LoginService()
      .changePassword(body)
      .then(
        async (valid: boolean | undefined): Promise<boolean | undefined> => {
          if (!valid) {
            this.setStatus(500);
          }
          return valid;
        }
      );
  }
}

@Route('changeEmail')
@Security('jwt')
export class EmailController extends Controller {
  @Post()
  @Response('500', 'Failed to change password')
  @SuccessResponse('200', 'Email changed')
  public async changeEmail(
    @Body() body: UpdateEmail
  ): Promise<boolean | undefined> {
    return new LoginService()
      .changeEmail(body)
      .then(
        async (valid: boolean | undefined): Promise<boolean | undefined> => {
          if (!valid) {
            this.setStatus(500);
          }
          return valid;
        }
      );
  }
}

// Doesn't connect to a function
// All this route is doing it replacing the cookie with an invalid one to basically
// overwrite the old one
@Route('logout')
export class LogoutController extends Controller {
  @Post()
  @SuccessResponse('200', 'Logged Out')
  public async logout(
    @Res() setCookieResponse: TsoaResponse<200, void> // Response to clear the cookie
  ): Promise<void> {
    // Clear the access token by setting its Max-Age to 0
    setCookieResponse(200, undefined, {
      'Set-Cookie': `accessToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
    });
  }
}
