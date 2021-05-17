import { Auth } from 'aws-amplify';
import Amplify from 'aws-amplify';
import { config } from './config';
import { CognitoUser } from '@aws-amplify/auth'
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk/lib/credentials';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: config.REGION,
        userPoolId: config.USER_POOL_ID,
        userPoolWebClientId: config.APP_CLIENT_ID,
        identityPoolId: config.IDENTITY_POOL_ID,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})




export class AuthService {


    public async login(userName: string, password: string){
        const user = await Auth.signIn(userName, password) as CognitoUser;
        return user;
    }


    public async getAWSTemporaryCreds(user: CognitoUser){
       const cognitoIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`; 
       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
           IdentityPoolId: config.IDENTITY_POOL_ID,
           Logins: {
               [cognitoIdentityPool]: user.getSignInUserSession()!.getIdToken().getJwtToken()
           }
       }, {
           region: config.REGION
       });
       await this.refreshCredentials();
    }


    private async refreshCredentials(): Promise<void>{
        return new Promise((resolve, reject)=>{
            (AWS.config.credentials as Credentials).refresh(err =>{
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}