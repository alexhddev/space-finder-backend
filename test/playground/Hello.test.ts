import { handler } from '../../services/SpacesTable/Read';

const event = {
    body: {
        location: 'Paris'
    }
}


const result = handler({} as any, {} as any).then((apiResult)=>{
    const items = JSON.parse(apiResult.body);
    console.log(123)
});