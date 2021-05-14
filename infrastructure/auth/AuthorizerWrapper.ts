import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/lib/aws-cognito";
import { Construct } from "constructs";


export class AuthorizerWrapper {

    private scope: Construct;
    private api: RestApi;

    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    public authorizer: CognitoUserPoolsAuthorizer;

    constructor(scope: Construct, api: RestApi){
        this.scope = scope;
        this.api = api;
        this.initialize();
    }

    private initialize(){
        this.createUserPool();
    }

    private createUserPool(){
        this.userPool = new UserPool(this.scope, 'SpaceUserPool', {
            userPoolName: 'SpaceUserPool',
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });
        new CfnOutput(this.scope, 'UserPoolId', {
            value: this.userPool.userPoolId
        })
    }
}