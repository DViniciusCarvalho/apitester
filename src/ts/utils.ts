import { DataUnity } from './types/data';


export function getScientificNotation(
    bytesSize: number
): string {

    const bytesNotation: DataUnity.BytesNotation[] = [
        {
            prefix: '',
            minBytes: 0
        },
        {
            prefix: 'K',
            minBytes: 1024
        },
        {
            prefix: 'M',
            minBytes: Math.pow(1024, 2)
        },
        {
            prefix: 'G',
            minBytes: Math.pow(1024, 3)
        }
    ];

    const formattedSize = bytesNotation.reduce((acc, notation, index) => {
        const isEqualOrGreaterThanCurrentNotation = bytesSize >= notation.minBytes;
        const nextIndex = index + 1;
        const nextNotationExists = nextIndex < bytesNotation.length;
        const isLessThanNextNotation = bytesNotation[nextIndex]
        ? bytesSize < (<DataUnity.BytesNotation> bytesNotation[nextIndex]).minBytes
        : false;

        if (isEqualOrGreaterThanCurrentNotation && nextNotationExists && isLessThanNextNotation) {
            const divisor = notation.minBytes ? notation.minBytes : 1;
            const decimalDigitsNumber = notation.minBytes ? 2 : 0;
            
            acc += (bytesSize === notation.minBytes)
                    ? `1${notation.prefix}` 
                    : `${(bytesSize / divisor).toFixed(decimalDigitsNumber)}${notation.prefix}`;
        }

        return acc;

    }, '');

    return formattedSize;
}


export function methodNeedBody(
    method: string
): boolean {

    const BODY_NEEDED_HTTP_METHODS = ['POST', 'PUT', 'PATCH'];
    
    return method in BODY_NEEDED_HTTP_METHODS;
}