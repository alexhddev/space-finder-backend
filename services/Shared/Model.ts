


export interface Space {
    spaceId: string,
    name: string,
    location: string,
    photoUrl?: string
}

export type ReservationState = 'PENDING' | 'APPROVED' | 'CANCELED'

export interface Reservation {
    reservationId: string,
    user: string,
    spaceId: string,
    state: ReservationState
}