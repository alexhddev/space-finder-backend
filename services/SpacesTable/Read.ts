import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader } from '../Shared/Utils';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    }
    addCorsHeader(result)
    try {
        if (event.queryStringParameters) {
            if (PRIMARY_KEY! in event.queryStringParameters) {
                result.body = await queryWithPrimaryPartition(event.queryStringParameters);
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters);
            }
        } else {
            result.body = await scanTable();
        }
    } catch (error) {
        result.body = error.message
    }
    return result
}

async function queryWithSecondaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': queryKey
        },
        ExpressionAttributeValues: {
            ':zzzz': queryValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
    const keyValue = queryParams[PRIMARY_KEY!];
    const queryResponse = await dbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: '#zz = :zzzz',
        ExpressionAttributeNames: {
            '#zz': PRIMARY_KEY!
        },
        ExpressionAttributeValues: {
            ':zzzz': keyValue
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function scanTable(){
    const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME!
    }).promise();
    return JSON.stringify(queryResponse.Items)
}





export { handler }