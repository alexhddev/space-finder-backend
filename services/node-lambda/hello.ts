import { v4 } from 'uuid'


async function handler(event: any, context: any) {
    console.log('Got an event:');
    console.log(event);
    return {
        statusCode: 200,
        body: 'Hello from lambda!' + v4()
    }
}

export { handler }