// this is where the endpoints themselves go
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
    Res
} from 'tsoa';
import { Request, Response as ExpressResponse } from 'express';
import { LoginService } from './account.module.service';
import { SignUpCredentials, UpdatePassword, UpdateEmail, UpdateUsername, Authenticated } from './account.module.index';

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
		@Body() body: SignUpCredentials): Promise<boolean|undefined> {
		return new LoginService().signup(body)
			.then(async (created: boolean | undefined): Promise <boolean |undefined> => {
				if (!created) {
					this.setStatus(409);
				}
				return created;
			});
	}
}


// @Route('login')
// export class LogInController extends Controller {
//     @Post()
//     @Response('401', 'Invalid Username or Password')
//     @SuccessResponse('200', 'Logged In') // also not sure about here
//     public async login(@Body() body: SignUpCredentials): Promise<Authenticated|undefined> {
//         return new LoginService().login(body)
//             .then(async (valid: Authenticated | undefined): Promise <Authenticated | undefined> => {
//             if(!valid) {
//                 this.setStatus(401);
//                 return undefined;
//             }
            
//             this.setHeader('Set-Cookie', `token=${valid.accessToken}; HttpOnly; Secure; SameSite=strict; Path=/`);

//             // below is reliant upon using ExpressResponse, which appears to not be working, and instead I must use TsoaResponse object
//             // res.cookie('accessToken', valid.accessToken,  {
//             //     httpOnly: true,
//             //     secure: true,
//             //     sameSite: 'strict',
//             //     path: '/'
//             // });
//             return valid;
//         })
//     }
// }
@Route('login')
export class LogInController extends Controller {
    @Post()
    @Response('401', 'Invalid Username or Password')
    @SuccessResponse('200', 'Logged In')
    public async login(
        @Body() body: SignUpCredentials,
        @Res() setCookieResponse: TsoaResponse<200 | 401, Authenticated | undefined> // Use Response to define cookie and valid
    ): Promise<Authenticated | undefined> {
        return new LoginService().login(body)
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
                    'Set-Cookie': `accessToken=${valid.accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
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
    public async changePassword(@Body() body: UpdatePassword): Promise<boolean|undefined> {
        return new LoginService().changePassword(body).then(async (valid: boolean | undefined): Promise <boolean | undefined> => {
            if(!valid) {
                this.setStatus(500);
            }
            return valid;
        })
    }
}

@Route('changeEmail')
@Security('jwt')
export class EmailController extends Controller {
    @Post()
    @Response('500', 'Failed to change password')
    @SuccessResponse('200', 'Email changed')
    public async changeEmail(@Body() body: UpdateEmail): Promise<boolean|undefined> {
        return new LoginService().changeEmail(body).then(async (valid: boolean | undefined): Promise <boolean | undefined> => {
            if(!valid) {
                this.setStatus(500);
            }
            return valid;
        })
    }
}

// @Route('changePassword')
// export class UsernameController extends Controller {
//     @Post()
//     @Response('500', 'Failed to change password')
//     @SuccessResponse('200', 'Username changed')
//     public async changeUsername(@Body() body: UpdateUsername): Promise<boolean|undefined> {
//         return new LoginService().changeUsername(body).then(async (valid: boolean | undefined): Promise <boolean | undefined> => {
//             if(!valid) {
//                 this.setStatus(500);
//             }
//             return valid;
//         })
//     }
// }