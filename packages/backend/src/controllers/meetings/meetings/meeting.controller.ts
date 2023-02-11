import {NextFunction, Request, Response} from "express";
import {query} from "../../../databases/mongodb";

export async function meeting_controller(req: Request, res: Response, next: NextFunction) {

    const meetings = await query('meetings');

    const response = await meetings.collection.updateOne({id: req.body.meeting_id}, {$set: { unread_messages_count: 0 }});

    res.send({
        data: response
    });
}
