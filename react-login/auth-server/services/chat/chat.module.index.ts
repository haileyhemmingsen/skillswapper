export interface Message {
    chatID?: string | undefined,
    message: string,
    sender: string,
    receiver: string,
    timestamp: Date
}

export interface Chat {
    second_chatter: string,
    chatID: string,
    messages: Returning_Message[]
}

export interface Returning_Message {
    sender_id: string,
    sender_name: string,
    message: string,
    time_sent: Date
    message_id: string
}

export interface Chat_Front {
    id: string,
    other_user_name: string,
    other_user_id: string,
    recent_message: string,
    read: boolean,
    time_sent: Date
}