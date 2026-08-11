// this code helps to get the info in the format which we want to get the response
import { Message } from "../model/User"

export interface Apiresponse {
    message : string,
    success : boolean,
    isAcceptingmessages : boolean,
    messages?: Array<Message>
}
