import {AuthorizationModel} from "./models";

export function splitAuthorizationHeader(header: string): AuthorizationModel[] {
    if(!header) return [];
    const splitAuthorizationHeaderThroughComma = header.split(',');
    return splitAuthorizationHeaderThroughComma.map((pieceOfHeader: string) => {
        const splitPieceThroughSpace = pieceOfHeader.trim().split(' ');
        return {
            type: splitPieceThroughSpace[0],
            base64key: splitPieceThroughSpace[1]
        }
    });
}