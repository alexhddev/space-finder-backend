import { App, Stack } from 'aws-cdk-lib'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path'


class PlayStack extends Stack {

    public initialize(){
        new NodejsFunction(this, 'PlayLambda' ,{
            entry: (join(__dirname, 'lambdas', 'PlayLambda.ts')),
            handler: 'handler',
            functionName: 'PlayLambda',
        })

    }
}
new PlayStack(new App(), 'PlayStack', {
    stackName:'PlayStack'
}).initialize();