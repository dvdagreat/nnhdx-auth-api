import { IResponse } from "@v1/types";
import { Response } from "express";

function generateResponse(success: string, message: string = "", payload: object = {}): IResponse {
    const resp: IResponse = {
        success: success,
        message: message,
        data: payload,
    };
    return resp;
}

export function fail(message: string, payload: object = {}): IResponse {
    return generateResponse("false", message, payload);
}

export function success(message: string, payload: object = {}): IResponse {
    return generateResponse("true", message, payload);
}

export function sendJsonWithStatus(res: Response, status: number, json: object = {}): Response {
    return res.status(status).json(json);
}
