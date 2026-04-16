import { useEffect, useState } from 'react'
import useCardStore from '../store/useCardStore'

const PositionDisplay = ({ cardID }: { cardID: string | null }) => {
    
    const cardsRef = useCardStore((state) => state.cardsRef)
    const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 })

    /*
        continuously sync the displayed position with the actual position of the card
        activeCardRef for when the user is dragging the card
        cardsRef for when other users are dragging the card
    */
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
    // including 'cards' ensures that when the socket calls setCards, acknowledge the data change

    return (
        <>({displayPos.x}, {displayPos.y})</>
    )
}

export default PositionDisplay