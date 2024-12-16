// this file is used to store the interface or declare type of the data that the API will require as input

export interface ILoginAPI {
    username: string;
    password: string;
}

export interface IRegisterAPI {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface ICheckUsernameAPI {
    username: string;
}

export interface ICheckEmailAPI {
    email: string;
}