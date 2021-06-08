import { Space, Reservation } from './Model'


export class MissingFieldError extends Error {}

export function validateAsReservationEntry(arg: any) {
    if ((arg as Reservation).reservationId == undefined ) {
        throw new MissingFieldError('Value for reservationId required!');        
    }
    if ((arg as Reservation).spaceId == undefined ) {
        throw new MissingFieldError('Value for spaceId required!');        
    }
    if ((arg as Reservation).state == undefined ) {
        throw new MissingFieldError('Value for state required!');        
    }
    if ((arg as Reservation).user == undefined ) {
        throw new MissingFieldError('Value for user required!');        
    }
    
}

export function validateAsSpaceEntry(arg: any){
    if(!(arg as Space).name){
        throw new MissingFieldError('Value for name required!')
    }
    if(!(arg as Space).location){
        throw new MissingFieldError('Value for location required!')
    }
    if(!(arg as Space).spaceId){
        throw new MissingFieldError('Value for spaceId required!')
    }
}