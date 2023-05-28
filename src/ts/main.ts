import { Requests } from "./types/requests";
import { Responses } from "./types/responses";
import { 
    handleAddHeader, 
    showHTTPStatus, 
    showResponseData, 
    showResponseDataBytesSize, 
    showRequestLatency 
} from "./dom";
import { methodNeedBody } from "./utils";


const sendButton = document.querySelector(".send__button") as HTMLButtonElement;
const addHeaderButton = document.querySelector(".add__request__header__button") as HTMLButtonElement;
const requestHeadersParent = document.querySelector(".request__headers__body")! as HTMLElement;

sendButton.addEventListener("click", handleSendButtonClick);
addHeaderButton.addEventListener("click", () => handleAddHeader(requestHeadersParent));


async function handleSendButtonClick(): Promise<void> {
    const urlElement = document.querySelector(".url") as HTMLInputElement;
    const requestURL = urlElement.value;
    const requestMethod = getRequestMethod();
    const requestHeaders = getRequestHeaders();
    const requestBody = getRequestBody(requestMethod);
    const requestConfig = arrangeRequestConfig(requestMethod, requestHeaders, requestBody);

    const { 
        status, 
        statusText, 
        ok, 
        data, 
        headers,
        body, 
        latency 
    } = await (doRequest(requestURL, requestConfig) as Promise<Responses.ResponseData>);

    handleShowRequestResponse(status, statusText, ok, data, headers, body, latency);
}


function getRequestMethod(): string {
    const methodElement = document.querySelector(".method") as HTMLSelectElement;
    const methodLowerCase = methodElement.value;
    const methodUpperCase = methodLowerCase.toUpperCase();

    return methodUpperCase;
}


function getRequestHeaders(): {[key: string]: string} {
    const headersTableRows = requestHeadersParent.children;

    const headers = Array.from(headersTableRows).reduce((acc, currentRow) => {
        const rowCells = currentRow.children;
        const rowKeyElement = rowCells[0] as HTMLTableCellElement;
        const rowValueElement = rowCells[1] as HTMLTableCellElement;
        const key = rowKeyElement.textContent as string;
        const value = rowValueElement.textContent as string;

        acc[key] = value;

        return acc;

    }, {} as {[key: string]: string});

    return headers;
}


function getRequestBody(method: string): string | void {
    const requestBodyElement = document.querySelector(".request__body") as HTMLPreElement;
    const requestBodyContent = requestBodyElement.textContent as string;

    if (methodNeedBody(method)) {
        try {
            const requestBodyJSOnified = JSON.parse(requestBodyContent);
            const stringfiedData = JSON.stringify(requestBodyJSOnified);
            return stringfiedData;
        }
        catch(error) {
            window.alert("Invalid data format. Strings must be between \" \"");
        }
    
        throw Error;
    }
}


function arrangeRequestConfig(
    method: string, 
    headers: {[key: string]: string}, 
    body?: string | void
): Requests.RequestParamsWithBody | Requests.RequestParamsWithoutBody {

    if (methodNeedBody(method)) {
        const parameters: Requests.RequestParamsWithBody = {
            method: method,
            headers: headers,
            body: body!
        };
        return parameters;

    }
    else {
        const parameters: Requests.RequestParamsWithoutBody = {
            method: method,
            headers: headers
        };
        return parameters;
    }
}


async function doRequest(
    urlValue: string, 
    requestConfig: Requests.RequestConfig
): Promise<Responses.ResponseData> {

    const startTime = performance.now();

    try {
        const successfulResponse = await fetch(urlValue, requestConfig);
        const finishTime = performance.now();
        const latency = Number((finishTime! - startTime).toFixed(0));
        return getRequestData(successfulResponse, latency);
    }
    catch(error) {
        const finishTime = performance.now();
        const latency = Number((finishTime! - startTime).toFixed(0));
        return getRequestData(error, latency);
    }

}


async function getRequestData(response: any, latency: number): Promise<Responses.ResponseData> {

    const { 
        status, 
        statusText, 
        ok, 
        headers, 
        body 
    } = response as Response;

    const data = await (response as Response).json();

    return { 
        status, 
        statusText, 
        ok, 
        data, 
        headers, 
        body, 
        latency 
    };
}


function handleShowRequestResponse(
    status: number, 
    statusText: string, 
    ok: boolean, 
    data: any, 
    headers: Headers | null, 
    body: ReadableStream<Uint8Array> | null,
    latency: number
): void {

    showHTTPStatus(status, statusText, ok);
    showResponseData(data);
    showResponseDataBytesSize(headers, body);
    showRequestLatency(latency);
}