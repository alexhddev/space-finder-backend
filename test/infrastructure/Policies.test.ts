import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/lib/aws-s3';
import { Policies } from '../../infrastructure/Policies';
import '@aws-cdk/assert/jest';
import { Effect } from 'aws-cdk-lib/lib/aws-iam';


describe('Policies test suite', ()=>{

    const stack = new Stack();
    const spacesPhotosBucket = {
        bucketArn: 'spacesPhotosBucketArn'
    };
    const profilePhotosBucket = {
        bucketArn: 'profilePhotosBucketArn'
    };;
    const policies: Policies = new Policies(spacesPhotosBucket as Bucket, profilePhotosBucket as Bucket);

    test('UploadProfilePhoto policy values', ()=>{
        const uploadProfilePhotoJSON = policies.uploadProfilePhoto.toJSON();
        expect(uploadProfilePhotoJSON.Action).toEqual([
            's3:PutObject',
            's3:PutObjectAcl'
        ])
        expect(uploadProfilePhotoJSON.Effect).toBe('Allow');
        expect(uploadProfilePhotoJSON.Resource).toBe('profilePhotosBucketArn/*');        
    });
    test('UploadSpacesPhoto policy values', ()=>{
        const uploadSpacesPhotoJSON = policies.uploadSpacePhotos.toJSON();
        expect(uploadSpacesPhotoJSON.Action).toEqual([
            's3:PutObject',
            's3:PutObjectAcl'
        ])
        expect(uploadSpacesPhotoJSON.Effect).toBe('Allow');
        expect(uploadSpacesPhotoJSON.Resource).toBe('spacesPhotosBucketArn/*');        
    });
});