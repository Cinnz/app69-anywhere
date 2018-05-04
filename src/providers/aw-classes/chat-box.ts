
/**
 * Chatbox của Vòng kết nối
 */
export class ChatBox{

    id: string;
    messages: Array<Message>;
    
}

class Message{

    uId: string;
    uAvatar: string;
    time: number;
    content: string;

}