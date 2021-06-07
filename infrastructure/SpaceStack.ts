import { CfnOutput, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import { AuthorizationType, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/lib/aws-apigateway'
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/lib/aws-iam';
import { AuthorizerWrapper } from './auth/AuthorizerWrapper';
import { Bucket, HttpMethods } from 'aws-cdk-lib/lib/aws-s3';
import { WebAppDeployment } from './WebAppDeployment';



export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceApi');
    private authorizer: AuthorizerWrapper;
    private suffix: string;
    private spacesPhotosBucket: Bucket;

    private spacesTable = new GenericTable(this,{
        tableName: 'SpacesTable',
        primaryKey: 'spaceId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        secondaryIndexes: ['location']
    } )

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)
        
        this.initializeSuffix();
        this.initializeSpacesPhotosBucket();
        this.authorizer = new AuthorizerWrapper(
            this,
            this.api,
            this.spacesPhotosBucket.bucketArn + '/*'
            );
        new WebAppDeployment(this, this.suffix);


        const optionsWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.authorizer.authorizerId
            }
        }

        //Spaces API integrations:
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration);
        spaceResource.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
        spaceResource.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration);
    }

    private initializeSuffix(){
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
        const Suffix = Fn.select(4, Fn.split('-', shortStackId));
        this.suffix = Suffix;
    }
    private initializeSpacesPhotosBucket(){
        this.spacesPhotosBucket = new Bucket(this, 'spaces-photos', {
            bucketName: 'spaces-photos-' + this.suffix,
            cors: [{
                allowedMethods:[
                    HttpMethods.HEAD,
                    HttpMethods.GET,
                    HttpMethods.PUT
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*']
            }]
        });
        new CfnOutput(this, 'spaces-photos-bucket-name', {
            value: this.spacesPhotosBucket.bucketName
        })
    }



}