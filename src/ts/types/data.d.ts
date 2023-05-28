export namespace DataUnity {
    interface BytesNotation {
        [key: string]: string | number;
        prefix: string;
        minBytes: number;
    }
}