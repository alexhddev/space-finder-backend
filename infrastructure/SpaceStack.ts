import { CfnOutput, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationType, MethodOptions, RestApi } from 'aws-cdk-lib/lib/aws-apigateway'
import { GenericTable } from './GenericTable';
import { AuthorizerWrapper } from './auth/AuthorizerWrapper';
import { Bucket, HttpMethods } from 'aws-cdk-lib/lib/aws-s3';
import { WebAppDeployment } from './WebAppDeployment';

export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceApi');
    private authorizer: AuthorizerWrapper;
    private suffix: string;
    private spacesPhotosBucket: Bucket;

    private spacesTable = new GenericTable(this, {
        tableName: 'SpacesTable',
        primaryKey: 'spaceId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        secondaryIndexes: ['location']
    })

    private reservationsTable = new GenericTable(this, {
        tableName: 'ReservationsTable',
        primaryKey: 'reservationId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        secondaryIndexes: ['user']
    })

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)

        this.initializeSuffix();
        this.initializeSpacesPhotosBucket();
        this.authorizer = new AuthorizerWrapper(
            this,
            this.api,
            this.spacesPhotosBucket.bucketArn);
        new WebAppDeployment(this, this.suffix);


        const optionsWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.authorizer.authorizerId
            }
        }

        //Spaces API integrations:
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration, optionsWithAuthorizer);
        spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration, optionsWithAuthorizer);
        spaceResource.addMethod('PUT', this.spacesTable.updateLambdaIntegration, optionsWithAuthorizer);
        spaceResource.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration, optionsWithAuthorizer);

        //Reservations API integrations:
        const reservationResource = this.api.root.addResource('reservations');
        reservationResource.addMethod('POST', this.reservationsTable.createLambdaIntegration, optionsWithAuthorizer);
        reservationResource.addMethod('GET', this.reservationsTable.readLambdaIntegration, optionsWithAuthorizer);
        reservationResource.addMethod('PUT', this.reservationsTable.updateLambdaIntegration, optionsWithAuthorizer);
        reservationResource.addMethod('DELETE', this.reservationsTable.deleteLambdaIntegration, optionsWithAuthorizer);
    }

    private initializeSuffix() {
        const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
        const Suffix = Fn.select(4, Fn.split('-', shortStackId));
        this.suffix = Suffix;
    }
    private initializeSpacesPhotosBucket() {
        this.spacesPhotosBucket = new Bucket(this, 'spaces-photos', {
            bucketName: 'spaces-photos-' + this.suffix,
            cors: [{
                allowedMethods: [
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