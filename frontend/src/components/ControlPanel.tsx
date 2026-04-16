import { useState } from 'react'
import { useSocket } from '../contexts/SocketContext'
import useCardStore from '../store/useCardStore'
import PositionDisplay from './PositionDisplay'

const ControlPanel = () => {
    
    // import from context and store
    const socket = useSocket()
    const cards = useCardStore((state) => state.cards)
    const activeCardID = useCardStore((state) => state.activeCardID)
    const updateCard = useCardStore((state) => state.updateCard)

    const [showPanel, setShowPanel] = useState(true)

    const activeCard = activeCardID ? cards[activeCardID] : null

    return (
        <aside className={`control-panel ${!showPanel ? 'hidden' : ''}`}>
            <h2>Editing: {activeCard ? activeCard.label : 'None'}</h2>
            
            <div className="control-panel-controls">
                <p>Position: <PositionDisplay cardID={activeCardID} /></p>
                
                <p>Rotation: {activeCard?.rotation || 0}°</p>
                <input
                    type="range"
                    min="-360"
                    max="360"
                    value={activeCard?.rotation || 0}
                    onChange={(e) => 
                        updateCard(
                            activeCardID!, 
                            { rotation: parseInt(e.target.value) }, 
                            socket
                        )
                    }
                />

                <p>Opacity: {activeCard?.opacity || 100}%</p>
                <input 
                    type="range"
                    min="0"
                    max="100"
                    value={activeCard?.opacity || 100}
                    onChange={(e) => 
                        updateCard(
                            activeCardID!, 
                            { opacity: parseInt(e.target.value) }, 
                            socket
                        )
                    }
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