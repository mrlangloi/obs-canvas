import { DndContext, type DragEndEvent, type DragMoveEvent } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { useCards } from '../contexts/CardContext'
import './Canvas.modules.css'
import Card, { type CardItem } from './Card'
import TwitchEmbed from './TwitchEmbed'

const Canvas = () => {

    // import from context
    const { cards, cardsRef, updateCardDragOnly, updateCard } = useCards()

    // handle the movement of cards during mouse-dragging
    const handleDragMove = (event: DragMoveEvent) => {
        const { active, delta } = event
        const id = active.id.toString()

        // find the id of the card being dragged
        const currentCard = cardsRef.current[id]

        if (currentCard) {
            // emit the movement to other clients
            updateCardDragOnly(id, {
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
        
        // if there was no movement, do nothing
        if (delta.x === 0 && delta.y === 0)
            return

        // find the id of the card being dragged
        const id = active.id.toString()
        const currentCard = cardsRef.current[id]

        if (currentCard) {
            // emit the movement to other clients
            updateCard(id, {
                position: {
                    x: currentCard.position.x + delta.x,
                    y: currentCard.position.y + delta.y
                }
            }, true) // true indicates this is the final update after dragging ends
        }
    }

    return (
        <main className="main-canvas">
            <DndContext
                modifiers={[restrictToParentElement]}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                {Object.values(cards).map((card) => (
                    <Card 
                        key={card.id} 
                        card={card} 
                    />
                ))}
            </DndContext>

            {/* TwitchEmbed */}
            <TwitchEmbed />
        </main>
    )
}

export default Canvas