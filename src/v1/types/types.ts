export interface IResponse {
    status: string;
    message?: string | object;
    data?: object;
}

export enum ResponseStatuses {
    f = "failure",
    s = "success",
}
