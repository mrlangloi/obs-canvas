import React, { useState } from 'react';
import { DndContext, type DragEndEvent, type DragMoveEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import throttle from 'lodash/throttle';
import Card, { type CardItem } from './Card';
import TwitchEmbed from './TwitchEmbed';
import './Canvas.modules.css';

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
        { id: 1, position: { x: 50, y: 50 }, label: "New Item 1", text: "Item 1" },
        { id: 2, position: { x: 200, y: 150 }, label: "New Item 2", text: "Item 2" },
    ]);

    // handle the movement of items during mouse-dragging
    const handleDragMove = (event: DragMoveEvent) => {
        const { active, delta } = event

        // find the starting position of the item being dragged
        const card = cards.find(i => i.id === active.id)

        if (card) {
            // emit the movement to other clients
            emitChange(active.id, {
                position: {
                    x: card.position.x + delta.x,
                    y: card.position.y + delta.y
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