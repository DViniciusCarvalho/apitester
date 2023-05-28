export namespace Requests {

    interface RequestParamsWithBody {
        method: string;
        headers: {[key: string]: string};
        body: string;
    }
    
    interface RequestParamsWithoutBody {
        method: string;
        headers: {[key: string]: string};
    }

    type RequestConfig = RequestParamsWithBody | RequestParamsWithoutBody;
}