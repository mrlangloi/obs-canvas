import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { type CardItem } from '../components/Card';

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
    cardsRef: React.RefObject<CardItem[]>
    updateCard: (id: number, attributes: Partial<CardItem>) => void
    setCards: React.Dispatch<React.SetStateAction<CardItem[]>>
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider = ({ children }: { children: ReactNode }) => {

    // placeholder data
    const [cards, setCards] = useState<CardItem[]>([
        { id: 1, position: { x: 50, y: 50 }, label: "New Item 1", text: "Item 1", url: "https://placehold.co/150x150", mediaType: 'image' },
        { id: 2, position: { x: 200, y: 150 }, label: "New Item 2", text: "Item 2", url: "https://placehold.co/150x150", mediaType: 'image' },
        { id: 3, position: { x: 350, y: 250 }, label: "New Item 3", text: "Item 3", url: "", mediaType: 'empty' },
    ])

    const cardsRef = useRef<CardItem[]>(cards)

    // keeps the ref updated with the latest list of cards
    useEffect(() => {
        cardsRef.current = cards
    }, [cards])

    // centralized update function for both mouse-dragging and control panel changes
    const updateCard = (id: number, attributes: Partial<CardItem>) => {
        setCards((prev) =>
            prev.map((card) => (card.id === id ? { ...card, ...attributes } : card))
        )
    }

    return (
        <CardContext.Provider value={{ cards, cardsRef, updateCard, setCards }}>
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