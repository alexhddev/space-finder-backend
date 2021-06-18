import { Effect, PolicyStatement } from "aws-cdk-lib/lib/aws-iam";
import { Bucket } from "aws-cdk-lib/lib/aws-s3";

export class Policies {

    private spacesPhotosBucket: Bucket;
    private profilePhotosBucket: Bucket;
    public uploadSpacePhotos: PolicyStatement;
    public uploadProfilePhoto: PolicyStatement;

    constructor(spacesPhotosBucket: Bucket, profilePhotosBucket: Bucket) {
        this.spacesPhotosBucket = spacesPhotosBucket;
        this.profilePhotosBucket = profilePhotosBucket;
        this.initialize()
    }

    private initialize() {
        this.uploadSpacePhotos = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:PutObject',
                's3:PutObjectAcl'
            ],
            resources: [this.spacesPhotosBucket.bucketArn + '/*']
        });
        this.uploadProfilePhoto = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                's3:PutObject',
                's3:PutObjectAcl'
            ],
            resources: [this.profilePhotosBucket.bucketArn + '/*']
        });
    }
}