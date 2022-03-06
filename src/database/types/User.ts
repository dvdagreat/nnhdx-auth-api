export interface IUserFindOptionsId {
    userId: string;
    username?: string;
    email?: string;
}

export interface IUserFindOptionsUsername {
    userId?: string;
    username: string;
    email?: string;
}

export interface IUserFindOptionsEmail {
    userId?: string;
    username?: string;
    email: string;
}

export interface IGetUserOptions {
    criteria: IUserFindOptionsId | IUserFindOptionsUsername | IUserFindOptionsEmail
    options?: object
}
