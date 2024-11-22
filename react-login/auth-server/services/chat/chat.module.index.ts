export interface Message {
    chatID?: string,
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
    sender: string,
    message: string
    time_sent: Date
}

export interface Chat_Front {
    id: string,
    other_user_name: string,
    recent_message: string,
    read: boolean,
    time_sent: Date
}