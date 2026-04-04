import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { type CardItem } from '../components/Card'
import { useSocket } from './SocketContext'
import { throttle } from 'lodash'

/*
some typings:
    CardItem - defines what a single "Card" is
    React.RefObject<T> - the official type for useRefs
    Partial<T> - allows updating specific fields without needing the entire item
    React.Dispatch<React.SetStateAction<T>> - the official type for the setCards function returned from useState
    ReactNode - includes any valid React child (string, number, element, fragment, etc.)
*/

interface CardContextType {
    cards: CardItem[]
    activeCardRef: React.RefObject<CardItem | null>
    cardsRef: React.RefObject<CardItem[]>
    activeCardID: string | null
    setActiveCardID: (id: string | null) => void
    updateCardDragOnly: (id: string, attributes: Partial<CardItem>) => void
    updateCard: (id: string, attributes: Partial<CardItem>, isFinal?: boolean) => void
    setCards: React.Dispatch<React.SetStateAction<CardItem[]>>
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider = ({ children }: { children: ReactNode }) => {

    // access the socket from SocketContext
    const socket = useSocket()

    // placeholder data
    const [cards, setCards] = useState<CardItem[]>([
        { id: "1", position: { x: 50, y: 50 }, label: "New Item 1", text: "Item 1", url: "https://placehold.co/150x150", mediaType: 'image' },
        { id: "2", position: { x: 200, y: 150 }, label: "New Item 2", text: "Item 2", url: "https://placehold.co/150x150", mediaType: 'image' },
        { id: "3", position: { x: 350, y: 250 }, label: "New Item 3", text: "Item 3", url: "", mediaType: 'empty' },
    ])
    const [activeCardID, setActiveCardID] = useState<string | null>(null)
    const activeCardRef = useRef<CardItem | null>(null)
    const cardsRef = useRef<CardItem[]>(cards)

    // keeps the ref updated with the latest list of cards
    useEffect(() => {
        cardsRef.current = cards
    }, [cards])

    useEffect(() => {
        if (!socket)
            return

        socket.on("card_update", (updatedCard: CardItem, senderId: string) => {
            // ignore updates from the same client to prevent feedback loops
            if (senderId === socket.id)
                return

            setCards((prev) => (
                prev.map(card => card.id === updatedCard.id ? updatedCard : card)
            ))
        })

        return () => {
            socket.off("card_update")
        }
    }, [socket])

    // throttled to limit the frequency of updates for better performance (~60fps)
    const throttledEmit = useRef(
        throttle((card: CardItem) => {
            socket.emit("card_update", card);
        }, 16) // ~60 updates per second
    ).current

    /*
        separate function for mouse-dragging updates.
        this separation is important to prevent conflicts
        between dnd-kit applying its own transform during
        dragging, resulting in a double-offset issue
     */
    const updateCardDragOnly = (id: string, attributes: Partial<CardItem>) => {
        const currentCard = cardsRef.current.find(card => card.id === id)

        if (currentCard) {
            const updatedCard = { ...currentCard, ...attributes }

            activeCardRef.current = updatedCard

            throttledEmit(updatedCard)
        }
    }

    // centralized update function for control panel changes
    const updateCard = (id: string, attributes: Partial<CardItem>, isFinal: boolean = false) => {
        const updatedList = cards.map((card) =>
            card.id === id ? { ...card, ...attributes } : card
        )

        const updatedCard = updatedList.find(c => c.id === id);

        if (updatedCard) {

            activeCardRef.current = updatedCard

            if (isFinal) {
                // emit the final update to other clients without throttling, and also save to the database
                console.log("Emitting final update for card " + id)
                // socket.emit("card_update", updatedCard)
                socket.emit("card_save", updatedCard)
            } else {
                throttledEmit(updatedCard)
            }
        }

        setCards(updatedList)
    }

    return (
        <CardContext.Provider value={{ cards, activeCardID, setActiveCardID, activeCardRef, cardsRef, updateCardDragOnly, updateCard, setCards }}>
            {children}
        </CardContext.Provider>
    )
}

export const useCards = () => {
    const context = useContext(CardContext)

    if (!context)
        throw new Error('useCards must be used within CardProvider')

    return context
}