import { create} from 'zustand'
import type { CardItem } from '../types/card'
import { throttle } from 'lodash'
import type { Socket } from 'socket.io-client'
import React from 'react'

/*
some typings:
    CardItem - defines what a single "Card" is

    Record<string, T> - an object with string keys and T values; i.e. a dictionary

    React.RefObject<T> - the official type for useRefs
    
    Partial<T> - allows updating specific fields without needing the entire item
*/

interface CardState {
    cards: Record<string, CardItem>,
    activeCardID: string | null,
    cardsRef: React.RefObject<Record<string, CardItem>>,

    // actions
    setCards: (cards: Record<string, CardItem>) => void,
    setActiveCardID: (id: string | null) => void,
    updateCardDragOnly: (id: string, attributes: Partial<CardItem>, socket: Socket) => void,
    updateCard: (id: string, attributes: Partial<CardItem>, socket: Socket, isFinal?: boolean) => void,
    handleRemoteCardUpdate: (updatedCard: CardItem) => void
}

// limit the frequency of updates for better performance (~60fps)
const throttledEmit = throttle((socket, card) => {
    socket.emit("card_update", card)
}, 17) // ~60 updates per second

const useCardStore = create<CardState>((set, get) => ({
    cards: {
        '1': { id: '1', position: { x: 50, y: 50 }, label: 'New Item 1', text: 'Item 1', url: 'https://placehold.co/150x150', mediaType: 'image' },
        '2': { id: '2', position: { x: 200, y: 150 }, label: 'New Item 2', text: 'Item 2', url: 'https://placehold.co/150x150', mediaType: 'image' },
        '3': { id: '3', position: { x: 350, y: 250 }, label: 'New Item 3', text: 'Item 3', url: '', mediaType: 'empty' },
    },
    activeCardID: null,
    cardsRef: { current: {} },

    setCards: (cards) => set({
        cards: cards,
        cardsRef: { current: cards }
    }),

    setActiveCardID: (id) => set({ activeCardID: id }),

    /*
        separate function for mouse-dragging updates.
        this separation is important to prevent conflicts
        between dnd-kit applying its own transform during
        dragging, resulting in a double-offset issue.
        also doesn't trigger re-renders, making it best for
        high-frequency updates like mouse-dragging
     */
    updateCardDragOnly: (id, attributes, socket) => {
        const state = get()
        const currentCard = state.cards[id]

        // checks if the card exists before trying to update it
        if (currentCard) {
            const updatedCard = { ...currentCard, ...attributes }
            state.cardsRef.current[id] = updatedCard
            throttledEmit(socket, updatedCard)
        }
    },

    // centralized update function for control panel changes
    // this function triggers re-renders, making it best for low-frequency updates
    updateCard: (id, attributes, socket, isFinal = false) => {
        set((state) => ({
            cards: {
                ...state.cards,
                [id]: {
                    ...state.cards[id],
                    ...attributes
                }
            }
        }))

        const updatedCard = get().cards[id]
        if (isFinal) {
            socket.emit("card_save", updatedCard)
        } else {
            throttledEmit(socket, updatedCard)
        }
    },

    handleRemoteCardUpdate: (updatedCard: CardItem) => {
        const { id } = updatedCard

        const state = get()
        state.cardsRef.current[id] = updatedCard

        set((state) => ({
            cards: {
                ...state.cards,
                [id]: updatedCard
            }
        }))
    }

}))

export default useCardStore