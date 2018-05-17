
/**
 * Chatbox của Vòng kết nối
 */
export class ChatBox {

    messages: Array<Message> = [];

    constructor(private _id: string) {

    }

    get id() {
        return this._id;
    }

    addNewMessages(messages: Array<Message>) {
        Array.prototype.push.apply(this.messages, messages);
    }
}

class Message {

    uId: string;
    uAvatar: string;
    name: string;
    time: number;
    content: string;

}