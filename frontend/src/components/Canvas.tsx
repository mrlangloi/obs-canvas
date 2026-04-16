import { DndContext, type DragEndEvent, type DragMoveEvent } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { useSocket } from '../contexts/SocketContext'
import { useShallow } from 'zustand/shallow'
import useCardStore from '../store/useCardStore'
import './Canvas.modules.css'
import Card from './Card'
import TwitchEmbed from './TwitchEmbed'

const Canvas = () => {

    // import from context and store
    const socket = useSocket()
    const cardIDs = useCardStore(useShallow((state) => Object.keys(state.cards)))
    const updateCardDragOnly = useCardStore((state) => state.updateCardDragOnly)
    const updateCard = useCardStore((state) => state.updateCard)

    // handle the movement of cards during mouse-dragging
    const handleDragMove = (event: DragMoveEvent) => {
        const { active, delta } = event
        const id = active.id.toString()

        // find the card being dragged
        const currentCard = cardIDs.includes(id) ? useCardStore.getState().cards[id] : null

        if (currentCard) {
            // emit the movement to other clients
            updateCardDragOnly(id, {
                position: {
                    x: currentCard.position.x + delta.x,
                    y: currentCard.position.y + delta.y
                }
            }, socket)
        }
    }

    // handle the end of dragging to save the final position to the database
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event
        
        // if there was no movement, do nothing
        if (delta.x === 0 && delta.y === 0)
            return

        // find the card being dragged
        const id = active.id.toString()
        const currentCard = cardIDs.includes(id) ? useCardStore.getState().cards[id] : null

        if (currentCard) {
            // emit the movement to other clients
            updateCard(id, {
                position: {
                    x: currentCard.position.x + delta.x,
                    y: currentCard.position.y + delta.y
                }
            }, socket, true) // true indicates this is the final update after dragging ends
        }
    }

    return (
        <main className="main-canvas">
            <DndContext
                modifiers={[restrictToParentElement]}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                {cardIDs.map((id) => (
                    <Card 
                        key={id} 
                        id={id}
                    />
                ))}
            </DndContext>

            {/* TwitchEmbed */}
            <TwitchEmbed />
        </main>
    )
}

export default Canvas