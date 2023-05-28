export namespace Responses {
    interface ResponseData {
        status: number; 
        statusText: string;
        ok: boolean; 
        data: any;
        headers: Headers
        body: ReadableStream<Uint8Array> | null;
        latency: number;
    }
}