"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendButton = document.querySelector(".send__button");
const addHeaderButton = document.querySelector(".add__request__header__button");
const requestHeadersParent = document.querySelector(".request__headers__body");
sendButton.addEventListener("click", handleSendButtonClick);
addHeaderButton.addEventListener("click", handleAddHeader);
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
    if (method !== "GET" && method !== "DELETE") {
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
    if (method === "GET" || method == "DELETE") {
        const parameters = {
            method: "GET",
            headers: headers
        };
        return parameters;
    }
    else {
        const parameters = {
            method: method,
            headers: headers,
            body: body
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
            if (error instanceof Response) {
                const finishTime = performance.now();
                const latency = Number((finishTime - startTime).toFixed(0));
                return getRequestData(error, latency);
            }
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
function showHTTPStatus(status, statusText, ok) {
    const statusElement = document.querySelector(".response__data__status__code");
    changeStatusElementClass(statusElement, ok);
    const statusElementText = status.toString();
    statusElement.textContent = statusElementText;
    statusElement.title = statusText;
}
function changeStatusElementClass(statusElement, ok) {
    const statusElementHasNotOkClass = statusElement === null || statusElement === void 0 ? void 0 : statusElement.classList.contains("not--ok");
    const statusElementHasOkClass = statusElement === null || statusElement === void 0 ? void 0 : statusElement.classList.contains("ok");
    if (ok) {
        if (statusElementHasNotOkClass) {
            statusElement === null || statusElement === void 0 ? void 0 : statusElement.classList.remove("not--ok");
        }
        statusElement === null || statusElement === void 0 ? void 0 : statusElement.classList.add("ok");
    }
    else {
        if (statusElementHasOkClass) {
            statusElement === null || statusElement === void 0 ? void 0 : statusElement.classList.remove("ok");
        }
        statusElement === null || statusElement === void 0 ? void 0 : statusElement.classList.add("not--ok");
    }
}
function showResponseData(data) {
    const responseDataElement = document.querySelector(".response__data");
    const formattedResponseData = JSON.stringify(data, null, 4);
    const colorfulFormattedResponseData = formattedResponseData
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/\b\d+\b/g, '<span class="number">$&</span>')
        .replace(/\b(true|false)\b/g, '<span class="boolean">$&</span>');
    responseDataElement.innerHTML = colorfulFormattedResponseData;
}
function showResponseDataBytesSize(headers, body) {
    const bytesSizeElement = document.querySelector(".response__data__bytes__size");
    const contentLength = headers === null || headers === void 0 ? void 0 : headers.get('content-length');
    const bytesSize = (() => {
        if (contentLength)
            return Number(contentLength);
        body === null || body === void 0 ? void 0 : body.getReader().read().then((data) => {
            if ('value' in data && data.value !== null) {
                const size = data.value.byteLength;
                return size;
            }
        });
        return 0;
    })();
    const formattedBytesSize = `${getScientificNotation(bytesSize)}B`;
    bytesSizeElement.textContent = formattedBytesSize;
}
function getScientificNotation(bytesSize) {
    const bytesNotation = [
        {
            prefix: "",
            minBytes: 0
        },
        {
            prefix: "K",
            minBytes: 1024
        },
        {
            prefix: "M",
            minBytes: Math.pow(1024, 2)
        },
        {
            prefix: "G",
            minBytes: Math.pow(1024, 3)
        }
    ];
    const formattedSize = bytesNotation.reduce((acc, notation, index) => {
        const isEqualOrGreaterThanCurrentNotation = bytesSize >= notation.minBytes;
        const nextIndex = index + 1;
        const nextNotationExists = nextIndex < bytesNotation.length;
        const isLessThanNextNotation = bytesNotation[nextIndex] ? bytesSize < bytesNotation[index + 1].minBytes : false;
        if (isEqualOrGreaterThanCurrentNotation && nextNotationExists && isLessThanNextNotation) {
            const divisor = notation.minBytes ? notation.minBytes : 1;
            const decimalDigitsNumber = notation.minBytes ? 2 : 0;
            acc += (bytesSize === notation.minBytes)
                ? `1${notation.prefix}`
                : `${(bytesSize / divisor).toFixed(decimalDigitsNumber)}${notation.prefix}`;
        }
        return acc;
    }, "");
    return formattedSize;
}
function showRequestLatency(latency) {
    const latencyElement = document.querySelector(".response__data__latency");
    const formattedLatency = `${latency.toFixed(0)}ms`;
    latencyElement.textContent = formattedLatency;
    latencyElement.classList.remove("good--latency");
    latencyElement.classList.remove("average--latency");
    latencyElement.classList.remove("bad--latency");
    if (latency < 100) {
        latencyElement.classList.add("good--latency");
    }
    else if (latency === 100 || latency <= 500) {
        latencyElement.classList.add("average--latency");
    }
    else {
        latencyElement.classList.add("bad--latency");
    }
}
function handleAddHeader() {
    const garbageIconSource = "../../assets/delete.png";
    const rowElement = document.createElement("tr");
    requestHeadersParent.appendChild(rowElement);
    const keyCellElement = document.createElement("td");
    keyCellElement.setAttribute("contenteditable", "true");
    keyCellElement.setAttribute("spellcheck", "false");
    rowElement.appendChild(keyCellElement);
    const valueCellElement = document.createElement("td");
    valueCellElement.setAttribute("contenteditable", "true");
    valueCellElement.setAttribute("spellcheck", "false");
    rowElement.appendChild(valueCellElement);
    const deleteIconCellElement = document.createElement("td");
    rowElement.appendChild(deleteIconCellElement);
    const deleteIconImage = document.createElement("img");
    deleteIconImage.setAttribute("src", garbageIconSource);
    deleteIconImage.setAttribute("alt", "garbage icon");
    deleteIconImage.addEventListener("click", (e) => removeRowFromDOM(e));
    deleteIconCellElement.appendChild(deleteIconImage);
    keyCellElement.focus();
}
function removeRowFromDOM(event) {
    var _a, _b;
    const targetElement = event.target;
    const row = (_a = targetElement.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    requestHeadersParent.removeChild(row);
    (_b = event.target) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", (e) => removeRowFromDOM(e));
}
