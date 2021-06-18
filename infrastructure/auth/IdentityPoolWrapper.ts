import { CfnOutput } from "aws-cdk-lib";
import { UserPool, UserPoolClient, CfnIdentityPool, CfnIdentityPoolRoleAttachment } from "aws-cdk-lib/lib/aws-cognito";
import { FederatedPrincipal, Role } from "aws-cdk-lib/lib/aws-iam";
import { Construct } from "constructs";
import { Policies } from "../Policies";




export class IdentityPoolWrapper {

    private scope: Construct;
    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private policies: Policies;

    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unAuthenticatedRole: Role;
    public adminRole: Role;

    constructor(scope: Construct, userPool: UserPool, userPoolClient: UserPoolClient, policies: Policies) {
        this.scope = scope;
        this.userPool = userPool;
        this.userPoolClient = userPoolClient;
        this.policies = policies;
        this.initialize();
    }

    private initialize() {
        this.initializeIdentityPool();
        this.initializeRoles();
        this.attachRoles();
    }

    private initializeIdentityPool() {
        this.identityPool = new CfnIdentityPool(this.scope, 'SpaceFinderIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [{
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            }]
        });
        new CfnOutput(this.scope, 'IdentityPoolId', {
            value: this.identityPool.ref
        })
    }

    private initializeRoles() {
        this.authenticatedRole = new Role(this.scope, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });
        this.authenticatedRole.addToPolicy(this.policies.uploadProfilePhoto);

        this.unAuthenticatedRole = new Role(this.scope, 'CognitoDefaultUnAuthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.adminRole = new Role(this.scope, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        this.adminRole.addToPolicy(this.policies.uploadSpacePhotos);
        this.adminRole.addToPolicy(this.policies.uploadProfilePhoto);
    
    }

    private attachRoles(){
        new CfnIdentityPoolRoleAttachment(this.scope, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                'authenticated': this.authenticatedRole.roleArn,
                'unauthenticated': this.unAuthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`
                }
            }
        })
    }


}