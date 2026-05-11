import { useEffect, useState } from 'react'
import useCardStore from '../store/useCardStore'
import { useSocket } from '../contexts/SocketContext'

const PositionDisplay = ({ cardID }: { cardID: string | null }) => {
    
    const socket = useSocket()

    const activeCardID = useCardStore((state) => state.activeCardID)
    const cardsRef = useCardStore((state) => state.cardsRef)
    const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 })
    const updateCard = useCardStore((state) => state.updateCard)

    // continuously sync the displayed position with the actual position of the card
    useEffect(() => {
        let frameID: number

        const sync = () => {
            if (cardID && cardsRef.current) {
                const card = cardsRef.current[cardID]
                if (card) {
                    setDisplayPos({
                        x: Math.round(card.position.x),
                        y: Math.round(card.position.y)
                    })
                }
            }
            frameID = requestAnimationFrame(sync)
        }

        frameID = requestAnimationFrame(sync)
        return () => cancelAnimationFrame(frameID)
    }, [cardID, cardsRef])
    // cardsRef needed in dependency array to ensure the latest reference is used

    return (
        <>
            (<input 
                type="text" 
                value={`(${displayPos.x})`}
                onChange={(e) => updateCard(
                    activeCardID!,
                    { position: { x: parseInt(e.target.value), y: displayPos.y } },
                    socket
                )}
            />
            ,
            <input 
                type="text"
                value={`(${displayPos.y})`}
                onChange={(e) => updateCard(
                    activeCardID!,
                    { position: { x: displayPos.x, y: parseInt(e.target.value) } },
                    socket
                )}
            />
            {/* ({displayPos.x}, {displayPos.y}) */}
            )
        </>
    )
}

export default PositionDisplay