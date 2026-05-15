import { useEffect, useRef } from 'react'
import useCardStore from '../store/useCardStore'
import { useSocket } from '../contexts/SocketContext'

const PositionDisplay = ({ cardID }: { cardID: string | null }) => {
    
    const socket = useSocket()

    const cardsRef = useCardStore((state) => state.cardsRef)
    const updateCard = useCardStore((state) => state.updateCard)

    const inputX = useRef<HTMLInputElement>(null)
    const inputY = useRef<HTMLInputElement>(null)

    // continuously sync the displayed position with the actual position of the card
    useEffect(() => {
        if (!cardID) return

        let frameID: number
        const sync = () => {
            const card = cardsRef.current?.[cardID]
            if (card && inputX.current && inputY.current) {
                const newX = card.position.x.toString()
                const newY = card.position.y.toString()
                
                // only update the value if it actually changed
                if (inputX.current.value !== newX)
                    inputX.current.value = newX

                if (inputY.current.value !== newY)
                    inputY.current.value = newY
            }
            frameID = requestAnimationFrame(sync)
        }

        frameID = requestAnimationFrame(sync)
        return () => cancelAnimationFrame(frameID)
    }, [cardID, cardsRef])
    // cardsRef needed in dependency array to ensure the latest reference is used

    const handleInputChange = (axis: 'x' | 'y', value: string) => {
        if (!cardID) return
        const numValue = parseInt(value) || 0
        const currentCard = cardsRef.current?.[cardID]
        
        const newPos = axis === 'x' 
            ? { x: numValue, y: currentCard?.position.y || 0 }
            : { x: currentCard?.position.x || 0, y: numValue }

        updateCard(cardID, { position: newPos }, socket, true)
    }

    return (
        <>
            (<input 
                ref={inputX}
                className="number-input"
                type="number" 
                defaultValue="0"
                onChange={(e) => handleInputChange('x', e.target.value)}
            />
            ,
            <input 
                ref={inputY}
                className="number-input"
                type="number"
                defaultValue="0"
                onChange={(e) => handleInputChange('y', e.target.value)}
            />)
        </>
    )
}

export default PositionDisplay