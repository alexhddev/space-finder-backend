async function handler(event: any, context: any) {
    console.log('Calling the PlayLambda!!');
    if(event.param1 == 1){
        throw new Error("Invalid param: " + event.param1);        
    }
    return {
        statusCode: 200,
        body: 'Hello from lambda'
    }
}

export { handler }