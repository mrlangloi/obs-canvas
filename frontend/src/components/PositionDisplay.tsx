import { useEffect, useState } from 'react'
import { useCards } from '../contexts/CardContext'

const PositionDisplay = ({ cardID }: { cardID: string | null }) => {
    const { cards, activeCardRef, cardsRef } = useCards()
    const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 })

    /*
        continuously sync the displayed position with the actual position of the card
        activeCardRef for when the user is dragging the card
        cardsRef for when other users are dragging the card
    */
    useEffect(() => {
        let frameID: number

        const sync = () => {
            if (!cardID) {
                setDisplayPos({ x: 0, y: 0 })
                return
            } else if (activeCardRef.current && activeCardRef.current.id === cardID) {
                // use the activeCardRef for the most responsive position updates during dragging
                setDisplayPos(activeCardRef.current.position)
            } else {
                // if someone else is dragging, use cardsRef to get the latest position
                const card = cardsRef.current[cardID]
                
                if (card) {
                    setDisplayPos(card.position)
                }
            }

            frameID = requestAnimationFrame(sync)
        }

        frameID = requestAnimationFrame(sync)

        return () => cancelAnimationFrame(frameID)
    }, [cardID, cards, cardsRef, activeCardRef])
    // including 'cards' ensures that when the socket calls setCards, acknowledge the data change

    return (
        <>({displayPos.x}, {displayPos.y})</>
    )
}

export default PositionDisplay