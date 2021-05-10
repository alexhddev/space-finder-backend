import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/SpacesTable/Update';

const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: 'e9b49294-ba9a-436f-afe1-a29979ee85ea'
    },
    body: {
        location: 'new location'
    }
} as any;


const result = handler(event, {} as any).then((apiResult)=>{
    const items = JSON.parse(apiResult.body);
    console.log(123)
});