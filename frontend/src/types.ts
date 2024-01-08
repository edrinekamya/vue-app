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

  interface Notification {
    id: ID
    userId: ID
    message: string
    type: string | null
    read: boolean
    referenceId: ID | null
    createdAt: string
  }

  interface Call {
    id: ID
    callerId: ID
    receiverId: ID
    startTime: string
    endTime: string | null
    status: 'MISSED' | 'ANSWERED' | 'DECLINED' | null
    video: boolean
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

  interface Channel {
    id: ID
    name: string
    adminId: ID
    isPrivate: boolean
    createdAt: string
    userId: string
  }

  interface ChannelParticipant {
    channelId: ID
    userId: ID
    createdAt: string
	}
	
	interface Chat extends User {
    messages: EntityState<Message>
  }

  interface EntityState<T> {
    [id: ID]: T
  }
}

export {}
