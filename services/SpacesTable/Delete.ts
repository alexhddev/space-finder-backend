import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader } from '../Shared/Utils';



const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }
    addCorsHeader(result)

    try {
        const spaceId = event.queryStringParameters?.[PRIMARY_KEY]

        if (spaceId) {
            const deleteResult = await dbClient.delete({
                TableName: TABLE_NAME,
                Key:{
                    [PRIMARY_KEY]: spaceId
                }
            }).promise();
            result.body = JSON.stringify(deleteResult);
        }
    } catch (error) {
        result.body = error.message;
    }

    return result
}

export { handler }