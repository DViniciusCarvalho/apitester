var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handleAddHeader, showHTTPStatus, showResponseData, showResponseDataBytesSize, showRequestLatency } from "./dom";
import { methodNeedBody } from "./utils";
const sendButton = document.querySelector(".send__button");
const addHeaderButton = document.querySelector(".add__request__header__button");
const requestHeadersParent = document.querySelector(".request__headers__body");
sendButton.addEventListener("click", handleSendButtonClick);
addHeaderButton.addEventListener("click", () => handleAddHeader(requestHeadersParent));
function handleSendButtonClick() {
    return __awaiter(this, void 0, void 0, function* () {
        const urlElement = document.querySelector(".url");
        const requestURL = urlElement.value;
        const requestMethod = getRequestMethod();
        const requestHeaders = getRequestHeaders();
        const requestBody = getRequestBody(requestMethod);
        const requestConfig = arrangeRequestConfig(requestMethod, requestHeaders, requestBody);
        const { status, statusText, ok, data, headers, body, latency } = yield doRequest(requestURL, requestConfig);
        handleShowRequestResponse(status, statusText, ok, data, headers, body, latency);
    });
}
function getRequestMethod() {
    const methodElement = document.querySelector(".method");
    const methodLowerCase = methodElement.value;
    const methodUpperCase = methodLowerCase.toUpperCase();
    return methodUpperCase;
}
function getRequestHeaders() {
    const headersTableRows = requestHeadersParent.children;
    const headers = Array.from(headersTableRows).reduce((acc, currentRow) => {
        const rowCells = currentRow.children;
        const rowKeyElement = rowCells[0];
        const rowValueElement = rowCells[1];
        const key = rowKeyElement.textContent;
        const value = rowValueElement.textContent;
        acc[key] = value;
        return acc;
    }, {});
    return headers;
}
function getRequestBody(method) {
    const requestBodyElement = document.querySelector(".request__body");
    const requestBodyContent = requestBodyElement.textContent;
    if (methodNeedBody(method)) {
        try {
            const requestBodyJSOnified = JSON.parse(requestBodyContent);
            const stringfiedData = JSON.stringify(requestBodyJSOnified);
            return stringfiedData;
        }
        catch (error) {
            window.alert("Invalid data format. Strings must be between \" \"");
        }
        throw Error;
    }
}
function arrangeRequestConfig(method, headers, body) {
    if (methodNeedBody(method)) {
        const parameters = {
            method: method,
            headers: headers,
            body: body
        };
        return parameters;
    }
    else {
        const parameters = {
            method: method,
            headers: headers
        };
        return parameters;
    }
}
function doRequest(urlValue, requestConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = performance.now();
        try {
            const successfulResponse = yield fetch(urlValue, requestConfig);
            const finishTime = performance.now();
            const latency = Number((finishTime - startTime).toFixed(0));
            return getRequestData(successfulResponse, latency);
        }
        catch (error) {
            const finishTime = performance.now();
            const latency = Number((finishTime - startTime).toFixed(0));
            return getRequestData(error, latency);
        }
    });
}
function getRequestData(response, latency) {
    return __awaiter(this, void 0, void 0, function* () {
        const { status, statusText, ok, headers, body } = response;
        const data = yield response.json();
        return {
            status,
            statusText,
            ok,
            data,
            headers,
            body,
            latency
        };
    });
}
function handleShowRequestResponse(status, statusText, ok, data, headers, body, latency) {
    showHTTPStatus(status, statusText, ok);
    showResponseData(data);
    showResponseDataBytesSize(headers, body);
    showRequestLatency(latency);
}
