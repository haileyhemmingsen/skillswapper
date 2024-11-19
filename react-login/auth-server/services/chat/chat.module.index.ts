export interface Message {
    chatID?: string,
    message: string,
    sender: string,
    receiver: string,
    timestamp: Date
}