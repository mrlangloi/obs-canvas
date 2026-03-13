import { DndContext, type DragEndEvent, type DragMoveEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import throttle from 'lodash/throttle';
import { useEffect, useRef, useState } from 'react';
import './Canvas.modules.css';
import Card, { type CardItem } from './Card';
import TwitchEmbed from './TwitchEmbed';

// defined outside so it doesn't need to be recreated on every render
// Partial<> type allows updating only specific fields without needing the entire item
// throttled to limit the frequency of updates for better performance (~60fps)
const emitChange = throttle((id: number, attributes: Partial<CardItem>) => {
    // emit the attribute changes to other clients
    // socket.emit('card_update', { id, ...attributes })
    console.log(`Emitting changes for card ${id}:`, attributes)
}, 16)

const Canvas = () => {

    // test elements
    const [cards, setCards] = useState<CardItem[]>([
        { id: 1, position: { x: 50, y: 50 }, label: "New Item 1", text: "Item 1", url: "https://placehold.co/150x150", mediaType: 'image' },
        { id: 2, position: { x: 200, y: 150 }, label: "New Item 2", text: "Item 2", url: "https://placehold.co/150x150", mediaType: 'image' },
        { id: 3, position: { x: 350, y: 250 }, label: "New Item 3", text: "Item 3", url: "", mediaType: 'empty' },
    ]);
    const cardsRef = useRef(cards)

    useEffect(() => {
        cardsRef.current = cards
    }, [cards])

    // handle the movement of cards during mouse-dragging
    const handleDragMove = (event: DragMoveEvent) => {
        const { active, delta } = event

        // find the id of the card being dragged
        const currentCard = cardsRef.current.find(card => card.id === active.id)

        if (currentCard) {
            // emit the movement to other clients
            emitChange(active.id, {
                position: {
                    x: currentCard.position.x + delta.x,
                    y: currentCard.position.y + delta.y
                }
            })
        }
    }

    // handle the end of dragging to save the final position to the database
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event

        // cancel any pending throttled calls to prevent "jumping"
        emitChange.cancel()

        setCards((prev) => {
            const updated = prev.map(card =>
                card.id === active.id
                    ? {
                        ...card,
                        position: {
                            x: card.position.x + delta.x,
                            y: card.position.y + delta.y
                        }
                    }
                    : card
            );

            // emit the final position to the backend/database
            const finalCard = updated.find(card => card.id === active.id)
            if (finalCard) {
                // save the final position to the database
                // socket.emit('card_save', finalCard)
            }

            return updated
        })
    }

    // generic function to update other attributes like rotation, opacity, zIndex, etc. in the future
    const updateItemAttribute = (id: number, attributes: Partial<CardItem>) => {
        // update local state
        setCards(prev => prev.map(card =>
            card.id === id ? { ...card, ...attributes } : card
        ))

        // emit the changes to other clients
        emitChange(id, attributes)
    }

    return (
        <main className="main-canvas">
            <DndContext
                modifiers={[restrictToParentElement]}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                {cards.map((card) => (
                    <Card key={card.id} card={card} />
                ))}
            </DndContext>

            {/* TwitchEmbed */}
            <TwitchEmbed />
        </main>
    );
};

export default Canvas;