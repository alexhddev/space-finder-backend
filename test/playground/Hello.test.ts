import { handler } from '../../services/SpacesTable/Create';

const event = {
    body: {
        location: 'Paris'
    }
}


handler(event as any, {} as any);