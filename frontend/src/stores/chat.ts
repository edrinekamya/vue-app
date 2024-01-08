import { socket } from '@/socket'
import { mande } from 'mande'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useAuthStore } from './auth'

const api = mande(`/api/friends`)

export const useChatStore = defineStore('chat', {
  state: () => ({
    entities: {} as EntityState<Chat>,
    isFetching: true,
    isLoading: false
  }),
  getters: {
    chats: (state): Chat[] => Object.values(state.entities)
  },
  actions: {
    hydrate() {
      this.isFetching = true
      api
        .get<EntityState<Chat>>()
        .then((data) => {
          this.entities = data
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.isFetching = false
        })
    },
    delete(id: ID, isLocal = false) {
      delete this.entities[id]
      if (!isLocal) {
        socket.emit('chat:deleted', id)
      }
    },
    read(senderId: ID, messageId: ID) {
      this.entities[senderId].messages[messageId] = {
        ...this.entities[senderId].messages[messageId],
        status: 'READ'
      }
      socket.emit('message:read', senderId, messageId)
    },
    bindEvents() {
      socket.on('message:new', (message: Message) => {
        this.entities[message.senderId].messages[message.id] = message
      })
      socket.on('message:received', (senderId: number, messageId: number) => {
        this.entities[senderId].messages[messageId] = {
          ...this.entities[senderId].messages[messageId],
          status: 'RECEIVED'
        }
      })
      socket.on('message:read', (senderId: number, messageId: number) => {
        this.entities[senderId].messages[messageId] = {
          ...this.entities[senderId].messages[messageId],
          status: 'READ'
        }
      })
      socket.on('chat:deleted', (friendId: number) => {
        delete this.entities[friendId]
      })
      socket.on('message:request', (message: Message, user: User) => {
        this.entities[user.id] = {
          ...user,
          messages: {
            [message.id]: message
          }
        }
      })
    },
    start() {
      this.bindEvents()
      this.hydrate()
    },

    send(payload: Partial<Message>, friendId: number, user?: User, isOptimistic = true) {
      this.isLoading = true
      const auth = useAuthStore()
      const senderId = auth.user.id
      const id = Math.random()
      const chatId = `${Math.min(senderId, friendId)}_${Math.max(Math.max(senderId, friendId))}`

      const message: Partial<Message> = {
        senderId,
        createdAt: new Date().toISOString(),
        chatId,
        status: 'SENT',
        ...payload
      }

      // optimistic update
      if (isOptimistic) {
        const optimisticUpdate = { ...message, id, status: 'PENDING' } as Message
        if (user) {
          // this is a friend request
          if (!this.entities[friendId]) {
            this.entities[friendId] = {
              ...user,
              messages: {
                [id]: optimisticUpdate
              }
            }
          }
        } else {
          this.entities[friendId].messages[id] = optimisticUpdate
        }
      }

      socket.emit('message:create', message, friendId, (data: Message) => {
        // actual update after acknowledgement from server

        delete this.entities[friendId].messages[id]
        this.entities[friendId].messages[data.id] = data
      })

      this.isLoading = true
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot))
}
