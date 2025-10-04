import { timeStamp } from "console";

export function renderResponse(data: any) {
    return {
        success: true,
        timeStamp: new Date().toISOString(),
        data,
    };
}

export function  renderError(message: string, code = 400) {
    return {
        success: false,
        code,
        timeStamp: new Date().toISOString(),
        error: message,
    };
}