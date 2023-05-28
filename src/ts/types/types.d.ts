
export interface RequestParams {
    method: string;
    headers: {[key: string]: string};
    body: string;
}

export interface ListRetrieveDeleteRequestParams {
    method: "GET" | "DELETE";
    headers: {[key: string]: string};
}

export interface BytesNotation {
    [key: string]: string | number;
    prefix: string;
    minBytes: number;
}

export interface ResponseData {
    status: number; 
    statusText: string;
    ok: boolean; 
    data: any;
    headers: Headers
    body: ReadableStream<Uint8Array> | null;
    latency: number;
}