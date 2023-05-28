import { getScientificNotation } from "./utils";
export function showHTTPStatus(status, statusText, ok) {
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
export function showResponseData(data) {
    const responseDataElement = document.querySelector(".response__data");
    const formattedResponseData = JSON.stringify(data, null, 4);
    const colorfulFormattedResponseData = formattedResponseData
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/\b\d+\b/g, '<span class="number">$&</span>')
        .replace(/\b(true|false)\b/g, '<span class="boolean">$&</span>');
    responseDataElement.innerHTML = colorfulFormattedResponseData;
}
export function showResponseDataBytesSize(headers, body) {
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
export function showRequestLatency(latency) {
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
export function handleAddHeader(requestHeadersParent) {
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
function removeRowFromDOM(event, requestHeadersParent) {
    var _a, _b;
    const targetElement = event.target;
    const row = (_a = targetElement.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    requestHeadersParent.removeChild(row);
    (_b = event.target) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", (e) => removeRowFromDOM(e, requestHeadersParent));
}
