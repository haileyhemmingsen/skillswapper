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
} from 'tsoa';

import { LoginService } from './login.module.service';
import { SignUpCredentials } from './login.module.index';

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

@Route('login')
export class LogInController extends Controller {
    @Post()
    @Response('401', 'Invalid Username or Password')
    @SuccessResponse('200', 'Logged In') // also not sure about here
    public async login(@Body body: SignUpCredentials): Promise<boolean|undefined> {
        return new LoginService().login(body).then(async (valid: boolean | undefined): Promise <boolean | undefined> => {
            if(!valid) {
                this.setStatus(401);
            }
            return valid;
        })
    }
}