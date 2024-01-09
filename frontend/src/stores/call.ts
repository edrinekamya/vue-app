import { socket } from '@/socket'
import { useInterval } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { secondsToTimeFormat } from '../util'
import { useAuthStore } from './auth'
import { useChatStore } from './chat'

export const useCallStore = defineStore('call', {
  state: () => ({
    peerConnection: null as unknown as RTCPeerConnection,
    remoteStream: new MediaStream(),
    localStream: null as unknown as MediaStream,
    remoteElement: null as any,
    localElement: null as any,
    isVideo: false,
    status: 'connecting' as RTCPeerConnectionState,
    peer: null as unknown as User,
    offer: null as unknown as any,
    isModalOpen: false,
    isNotificationOpen: false,
    isMuted: false,
    isSpeaker: false,
    interval: useInterval(1000, {
      immediate: false,
      controls: true
    }),
    isInitiator: false,
    isCallSent: false
  }),
  getters: {
    isConnected: (state) => state.status === 'connected',
    duration: (state) => secondsToTimeFormat(state.interval.counter)
  },
  actions: {
    bindEvents() {
      socket.on('call-data', this.onData)
    },

    async getStreams() {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: this.isVideo
      })
      this.remoteStream = new MediaStream()
      this.remoteElement.srcObject = this.remoteStream
      this.localElement.srcObject = this.localStream
      this.localStream.getTracks().forEach((track) => this.peerConnection.addTrack(track))
    },

    async createPeerConnection() {
      this.peerConnection = new RTCPeerConnection()
      await this.getStreams()
      this.peerConnection.ontrack = this.ontrack
      this.peerConnection.onicecandidate = this.onicecandidate
      this.peerConnection.onconnectionstatechange = this.onconnectionstatechange
    },

    onicecandidate({ candidate }: RTCPeerConnectionIceEvent) {
      candidate && this.sendData('icecandidate', candidate)
    },

    onconnectionstatechange() {
      this.status = this.peerConnection.connectionState
      if (this.status === 'connected') {
        this.interval.resume()
      }
    },

    ontrack({ track }: RTCTrackEvent) {
      this.remoteStream.addTrack(track)
    },

    onOffer({ offer, isVideo }: any) {
      this.offer = offer
      this.isVideo = isVideo
      if (!this.peerConnection) {
        this.sendData('status', 'ringing')
        // new call, open incoming call notification
        this.isNotificationOpen = true
      } else {
        // negotiation needed simply send the answer
        this.createAndSendAnswer()
      }
    },

    onData({ type, data }: any, sender: User) {
      switch (type) {
        case 'offer':
          this.peer = sender
          this.onOffer(data)
          break
        case 'answer':
          this.onAnswer(data)
          break
        case 'icecandidate':
          this.addIceCandidate(data)
          break
        case 'mode':
          this.isVideo = !this.isVideo
          this.getStreams()
          break
        case 'status':
          this.status = data
          break
        default:
          this.close()
          break
      }
    },

    onAnswer(answer: any) {
      this.peerConnection
        .setRemoteDescription(new RTCSessionDescription(answer))
        .catch((e) => console.log(e))
    },

    addIceCandidate(candidate: any) {
      this.peerConnection && this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    },

    createAndSendOffer() {
      this.peerConnection
        .createOffer()
        .then((offer) => this.peerConnection.setLocalDescription(offer))
        .then(() =>
          this.sendData('offer', {
            offer: this.peerConnection.localDescription,
            isVideo: this.isVideo
          })
        )
    },

    start(peer: User, isVideo: boolean) {
      this.peer = peer
      this.isVideo = isVideo
      this.isInitiator = true
      this.createPeerConnection()
        .then(() => {
          this.peerConnection.onnegotiationneeded = this.createAndSendOffer
          this.isModalOpen = true
        })
        .catch(() => {
          // user denied access
          this.alert()
        })
    },

    createAndSendAnswer() {
      this.peerConnection
        .setRemoteDescription(new RTCSessionDescription(this.offer))
        .then(() => this.peerConnection.createAnswer())
        .then((answer) => this.peerConnection.setLocalDescription(answer))
        .then(() => this.sendData('answer', this.peerConnection.localDescription))
    },

    alert() {
      alert(
        `Your device ${
          this.isVideo ? 'camera and microphone are' : 'microphone is'
        }  required to start a ${this.isVideo ? 'video' : 'voice'} call`
      )
    },

    answer() {
      this.createPeerConnection()
        .then(this.createAndSendAnswer)
        .then(() => {
          this.isModalOpen = true
        })
        .catch(() => {
          // probably denied access to media devices
          this.alert()
        })
        .finally(() => {
          this.isNotificationOpen = false
        })
    },

    reject() {
      this.isNotificationOpen = false
      useChatStore().send(
        {
          status: 'SENT',
          type: this.isVideo ? 'VIDEO-CALL' : 'VOICE-CALL',
          message: this.duration,
          senderId: this.peer.id
        },
        this.peer.id
      )
      this.sendData('rejected', 'rejected')
      this.offer = null
    },

    sendData(type: string, data: any) {
      socket.emit('call-data', { type, data }, this.peer.id, () => {
        this.isCallSent = true
      })
    },

    toggle() {
      this.isVideo = !this.isVideo
      this.getStreams()
        .then(() => {
          this.sendData('mode', this.isVideo)
        })
        .catch(() => {
          // revert back to original mode
          this.isVideo = !this.isVideo
        })
    },

    mute() {
      this.isMuted = !this.isMuted
    },
    speaker() {
      this.isSpeaker = !this.isSpeaker
    },

    hangup() {
      if (this.peer) {
        const auth = useAuthStore()
        const status = this.isInitiator
          ? !this.isCallSent
            ? 'PENDING'
            : this.status === 'connected'
              ? 'READ'
              : 'SENT'
          : 'READ'
        useChatStore().send(
          {
            status,
            type: this.isVideo ? 'VIDEO-CALL' : 'VOICE-CALL',
            message: this.duration,
            senderId: this.isInitiator ? auth.user.id : this.peer.id,
            createdAt: new Date().toISOString()
          },
          this.peer.id
        )
        this.sendData('call-ended', 'ended')
        this.close()
      }
    },

    close() {
      this.isNotificationOpen = false
      // Stop all tracks and end the stream
      this.localStream.getTracks().forEach((track) => {
        track.stop()
      })

      this.peerConnection.removeEventListener('connectionstatechange', this.onconnectionstatechange)
      this.peerConnection.removeEventListener('icecandidate', this.onicecandidate)
      this.peerConnection.removeEventListener('track', this.ontrack)

      // Close the peer connection
      this.peerConnection && this.peerConnection.close()

      // Reset state
      this.$reset()
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCallStore, import.meta.hot))
}
