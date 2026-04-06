import { useState, useEffect } from 'react'
import { useCards } from '../contexts/CardContext'
import type { CardItem } from './Card'

const ControlPanel = () => {
    // may need cards variable later
    const { cards, activeCardRef, activeCardID, cardsRef, updateCard } = useCards()

    const [showPanel, setShowPanel] = useState(true)
    // const [displayCard, setDisplayCard] = useState<CardItem | null>(null)

    const activeCard = cardsRef.current.find(card => card.id === activeCardID)

    /*
        using requestAnimationFrame ensures the control panel
        updates without causing a full re-render

    */
    // useEffect(() => {
    //     let frameId: number

    //     const loop = () => {
    //         // if dragging, grab the data from the Ref
    //         if (activeCardRef.current) {
    //             setDisplayCard(activeCardRef.current)
    //         } else {
    //             // otherwise, fall back to the static state for the active card
    //             const staticCard = cardsRef.current.find(c => c.id === activeCardID)
    //             setDisplayCard(staticCard || null)
    //         }
    //         frameId = requestAnimationFrame(loop)
    //     }

    //     frameId = requestAnimationFrame(loop)

    //     return () => {
    //         cancelAnimationFrame(frameId)
    //     }
    // }, [activeCardID, cardsRef, activeCardRef])

    return (
        <aside className={`control-panel ${!showPanel ? 'hidden' : ''}`}>
            <h2>Editing: {activeCard ? activeCard.label : 'None'}</h2>
            
            <div className="control-panel-controls">
                <p>Position: ({activeCard?.position.x || 0}, {activeCard?.position.y || 0})</p>
                
                <p>Rotation: {activeCard?.rotation || 0}°</p>
                <input
                    type="range"
                    min="-360"
                    max="360"
                    value={activeCard?.rotation || 0}
                    onChange={(e) => updateCard(activeCardID!, { rotation: parseInt(e.target.value) })}
                />

                <p>Opacity: {activeCard?.opacity || 100}%</p>
                <input 
                    type="range"
                    min="0"
                    max="100"
                    value={activeCard?.opacity || 100}
                    onChange={(e) => updateCard(activeCardID!, { opacity: parseInt(e.target.value) })}
                />
            </div>
            <button className="toggle-tab" onClick={() => setShowPanel(!showPanel)}>
                {showPanel ? '◀' : '▶'}
            </button>
            <h2 className="control-panel-title">Control Panel</h2>
        </aside>
    )
}

export default ControlPanel