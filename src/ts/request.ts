const sendButton = document.querySelector(".send__button") as HTMLButtonElement;
const addHeaderButton = document.querySelector(".add__request__header__button") as HTMLButtonElement;
const requestHeadersParent = document.querySelector(".request__headers__body")!;

interface RequestParams {
    method: string;
    headers: {[key: string]: string};
    body: string;
}

interface GetRequestParams {
    method: "GET";
    headers: {[key: string]: string};
}

interface BytesNotation {
    [key: string]: string | number;
    prefix: string;
    minBytes: number;
}

interface ResponseData {
    status: number; 
    statusText: string;
    ok: boolean; 
    data: any;
    headers: Headers
    body: ReadableStream<Uint8Array> | null;
    latency: number;
}


sendButton.addEventListener("click", handleSendButtonClick);
addHeaderButton.addEventListener("click", handleAddHeader);

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
    } = await (doRequest(requestURL, requestConfig) as Promise<ResponseData>);

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

    if (method !== "GET") {
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

function arrangeRequestConfig(method: string, headers: {[key: string]: string}, body?: string | void): 
RequestParams | GetRequestParams {
    if (method === "GET") {
        const parameters: GetRequestParams = {
            method: "GET",
            headers: headers
        };
        return parameters;
    }
    else {
        const parameters: RequestParams = {
            method: method,
            headers: headers,
            body: body!
        };
        return parameters;
    }
}

async function doRequest(urlValue: string, requestConfig: RequestParams | GetRequestParams) {
    const startTime = performance.now();

    try {
        const successfulResponse = await fetch(urlValue, requestConfig);
        const finishTime = performance.now();
        const latency = Number((finishTime! - startTime).toFixed(0));
        return getRequestData(successfulResponse, latency);
    }
    catch(error: any) {
        if (error instanceof Response) {
            const finishTime = performance.now();
            const latency = Number((finishTime! - startTime).toFixed(0));
            return getRequestData(error, latency);
        }
    }

}

async function getRequestData(response: any, latency: number): Promise<ResponseData> {

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

function showHTTPStatus(status: number, statusText: string, ok: boolean): void {
    const statusElement = document.querySelector(".response__data__status__code") as HTMLElement;
    changeStatusElementClass(statusElement, ok);
    const statusElementText = status.toString();
    statusElement!.textContent = statusElementText;
    statusElement.title = statusText;
}

function changeStatusElementClass(statusElement: HTMLElement, ok: boolean): void {
    const statusElementHasNotOkClass = statusElement?.classList.contains("not--ok");
    const statusElementHasOkClass = statusElement?.classList.contains("ok");

    if (ok) {
        if (statusElementHasNotOkClass) {
            statusElement?.classList.remove("not--ok");
        }
        statusElement?.classList.add("ok");
    }
    else {
        if (statusElementHasOkClass) {
            statusElement?.classList.remove("ok");
        }
        statusElement?.classList.add("not--ok");
    }
}

function showResponseData(data: any): void {
    const responseDataElement = document.querySelector(".response__data") as HTMLPreElement;
    const formattedResponseData = JSON.stringify(data, null, 4);
    const colorfulFormattedResponseData = formattedResponseData
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/\b\d+\b/g, '<span class="number">$&</span>')
        .replace(/\b(true|false)\b/g, '<span class="boolean">$&</span>');
    responseDataElement.innerHTML = colorfulFormattedResponseData;
}

function showResponseDataBytesSize(headers: Headers | null, body: ReadableStream<Uint8Array> | null): void {
    const bytesSizeElement = document.querySelector(".response__data__bytes__size") as HTMLElement;
    const contentLength = headers?.get('content-length');

    const bytesSize = (() => {
        if (contentLength) return Number(contentLength);

        body?.getReader().read().then((data: ReadableStreamReadResult<Uint8Array>) => {
            if ('value' in data && data.value !== null) {
                const size = data.value!.byteLength;
                return size;
            } 
        });

        return 0;
    })();

    const formattedBytesSize = `${getScientificNotation(bytesSize)}B`;
    bytesSizeElement.textContent = formattedBytesSize;
}

function getScientificNotation(bytesSize: number): string {
    const bytesNotation: BytesNotation[] = [
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
        const isLessThanNextNotation = bytesNotation[nextIndex]? bytesSize < ((bytesNotation[index + 1] as unknown) as BytesNotation).minBytes : false;

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

function showRequestLatency(latency: number): void {
    const latencyElement = document.querySelector(".response__data__latency") as HTMLElement;
    const formattedLatency = `${latency.toFixed(0)}ms`
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

function handleAddHeader(): void {
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

function removeRowFromDOM(event: MouseEvent): void {
    const targetElement = event.target! as HTMLElement;
    const row = targetElement.parentElement?.parentElement;
    requestHeadersParent.removeChild(row!);
    event.target?.removeEventListener("click", (e) => removeRowFromDOM(e as MouseEvent));
}