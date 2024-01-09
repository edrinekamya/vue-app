declare global {
  type ID = number
  interface User {
    id: ID
    username: string
    avatar?: string
    createdAt: string
  }

  interface Friend {
    userId: ID
    friendId: ID
    id: string
    status: 'REQUEST' | 'FRIEND'
    createdAt: string
  }

  interface Message {
    id: ID
    senderId: ID
    channelId?: ID
    chatId?: string
    message: string
    type: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE-CALL' | 'REQUEST' | 'VIDEO-CALL'
    createdAt: string
    status: 'PENDING' | 'SENT' | 'RECEIVED' | 'READ'
  }

  interface Chat extends User {
    messages: EntityState<Message>
  }

  interface EntityState<T> {
    [id: ID]: T
  }
}

export {}
