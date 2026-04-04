import { DndContext, type DragEndEvent, type DragMoveEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { useCards } from '../contexts/CardContext';
import './Canvas.modules.css';
import Card, { type CardItem } from './Card';
import TwitchEmbed from './TwitchEmbed';

const Canvas = () => {

    // import from context
    const { cards, cardsRef, updateCardDragOnly, updateCard } = useCards()

    // handle the movement of cards during mouse-dragging
    const handleDragMove = (event: DragMoveEvent) => {
        const { active, delta } = event

        // find the id of the card being dragged
        const currentCard = cardsRef.current.find(card => card.id === active.id)

        if (currentCard) {
            // emit the movement to other clients
            updateCardDragOnly(active.id.toString(), {
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

        // find the id of the card being dragged
        const currentCard = cardsRef.current.find(card => card.id === active.id)

        if (currentCard) {
            // emit the movement to other clients
            updateCard(active.id.toString(), {
                position: {
                    x: currentCard.position.x + delta.x,
                    y: currentCard.position.y + delta.y
                }
            }, true) // true indicates this is the final update after dragging ends
        }
    }

    // generic function to update other attributes like rotation, opacity, zIndex, etc. in the future
    // const updateItemAttribute = (id: number, attributes: Partial<CardItem>) => {
    //     // update local state
    //     setCards(prev => prev.map(card =>
    //         card.id === id ? { ...card, ...attributes } : card
    //     ))

    //     // emit the changes to other clients
    //     emitChange(id, attributes)
    // }

    return (
        <main className="main-canvas">
            <DndContext
                modifiers={[restrictToParentElement]}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                {cards.map((card) => (
                    <Card 
                        key={card.id} 
                        card={card} 
                    />
                ))}
            </DndContext>

            {/* TwitchEmbed */}
            <TwitchEmbed />
        </main>
    );
};

export default Canvas;