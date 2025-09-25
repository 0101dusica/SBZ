export enum Gender {
    Male = 0,
    Female = 1
}

export interface User {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: Gender;
}