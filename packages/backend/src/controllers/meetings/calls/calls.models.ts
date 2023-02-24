export interface CallModel {
    id: string;
    fullDate: Date;
    expires: Date;
    status: 'active' | 'not_active' | 'finished';
}