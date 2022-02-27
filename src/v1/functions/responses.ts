import { IResponse, ResponseStatuses } from "../types/types";

export function generateResponse(
    status: ResponseStatuses,
    message: string = "",
    payload: object = {}
): IResponse {
    const resp: IResponse = {
        status: status,
        message: message,
        data: payload,
    };
    return resp;
}
