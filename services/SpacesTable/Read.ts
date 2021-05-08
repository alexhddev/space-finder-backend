import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }
    try {
        const queryResponse = await dbClient.scan({
            TableName: TABLE_NAME!
        }).promise();
        result.body = JSON.stringify(queryResponse)
    } catch (error) {
        result.body = error.message
    }


    return result

}

export { handler }