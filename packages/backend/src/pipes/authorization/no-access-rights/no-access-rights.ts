import {Response} from "express";

export function noAccessRights(res: Response) {
    res.status(401).send({ error: 'Unauthorized', message: 'No access rights' }).end();
}