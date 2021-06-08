import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { addCorsHeader, getEventBody, isIncludedInGroup } from '../Shared/Utils'



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
        if (isIncludedInGroup('admins', event)) {
            const requestBody = getEventBody(event)
            const newState = 'state' in requestBody ? requestBody.state : '';
            const reservationId = event.queryStringParameters?.[PRIMARY_KEY]

            if (reservationId && isValidState(newState)) {
                const requestBodyKey = Object.keys(requestBody)[0];
                const requestBodyValue = requestBody[requestBodyKey];

                const updateResult = await dbClient.update({
                    TableName: TABLE_NAME,
                    Key: {
                        [PRIMARY_KEY]: reservationId
                    },
                    UpdateExpression: 'set #zzzNew = :new',
                    ExpressionAttributeValues: {
                        ':new': requestBodyValue
                    },
                    ExpressionAttributeNames: {
                        '#zzzNew': requestBodyKey
                    },
                    ReturnValues: 'UPDATED_NEW'
                }).promise();

                result.body = JSON.stringify(updateResult)
            } else {
                result.statusCode = 400;
                result.body = 'Invalid request!'
            }
        } else {
            result.body = JSON.stringify('Not authorized!')
            result.statusCode = 403;
        }
    } catch (error) {
        result.statusCode = 500;
        result.body = error.message
    }


    return result

}

function isValidState(newState: any) {
    if (newState == 'PENDING' ||
        newState == 'APPROVED' ||
        newState == 'CANCELED') {
        return true
    } else {
        return false
    }
}

export { handler }