import { getScientificNotation } from "./utils";


export function showHTTPStatus(status: number, statusText: string, ok: boolean): void {
    
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


export function showResponseData(data: any): void {

    const responseDataElement = document.querySelector(".response__data") as HTMLPreElement;
    const formattedResponseData = JSON.stringify(data, null, 4);
    const colorfulFormattedResponseData = formattedResponseData
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/\b\d+\b/g, '<span class="number">$&</span>')
        .replace(/\b(true|false)\b/g, '<span class="boolean">$&</span>');

    responseDataElement.innerHTML = colorfulFormattedResponseData;

}


export function showResponseDataBytesSize(headers: Headers | null, body: ReadableStream<Uint8Array> | null): void {

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


export function showRequestLatency(latency: number): void {

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


export function handleAddHeader(requestHeadersParent: HTMLElement): void {

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
    deleteIconImage.addEventListener("click", (e) => removeRowFromDOM(e, requestHeadersParent));
    deleteIconCellElement.appendChild(deleteIconImage);

    keyCellElement.focus();

}


function removeRowFromDOM(event: MouseEvent, requestHeadersParent: HTMLElement): void {

    const targetElement = event.target! as HTMLElement;
    const row = targetElement.parentElement?.parentElement;
    requestHeadersParent.removeChild(row!);

    event.target?.removeEventListener(
        "click", 
        (e) => removeRowFromDOM(e as MouseEvent, requestHeadersParent)
    );

}