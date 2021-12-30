import { App, Stack } from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path'


class PlayStack extends Stack {

    public initialize(){


    }
}
new PlayStack(new App(), 'PlayStack', {
    stackName:'PlayStack'
}).initialize();