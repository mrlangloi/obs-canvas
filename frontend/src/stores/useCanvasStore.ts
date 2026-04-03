import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import Card, { type CardItem } from '../components/Card';

interface CanvasState {
  socket: Socket | null
  cards: Record<string, CardItem>
  activeCardID: string | null
  
  // Actions
  initSocket: () => void
  setActiveCardID: (id: string | null) => void
  updateCard: (id: string, attributes: Partial<CardItem>, emit?: boolean) => void
  setInitialCards: (cards: CardItem[]) => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  socket: null,
  cards: {},
  activeCardID: null,

  initSocket: () => {
    if (get().socket) 
        return

    const socket = io('http://localhost:5174')

    socket.on('connect', () => {
      console.log('Connected to backend:', socket.id)
    })

    // listen for updates from other clients
    socket.on('card_update', (data: { id: string } & Partial<CardItem>) => {
      const { id, ...attributes } = data
      get().updateCard(id, attributes, false) // update locally, don't re-emit
    })

    set({ socket })
  },

  setActiveCardID: (id) => set({ activeCardID: id }),

  updateCard: (id, attributes, emit = true) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [id]: { ...state.cards[id], ...attributes },
      },
    }))

    if (emit) {
      get().socket?.emit('card_update', { id, ...attributes })
    }
  },

  setInitialCards: (cardsArray) => {
    const cardsMap = cardsArray.reduce((acc, card) => {
      acc[card.id] = card
      return acc
    }, {} as Record<string, CardItem>)
    set({ cards: cardsMap })
  },
}))