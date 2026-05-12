import type React from 'react'
import { useSocket } from '../contexts/SocketContext'
import useCardStore from '../store/useCardStore'
import PositionDisplay from './PositionDisplay'
import type { CardItem } from '../types/card'

const ControlPanelControls = () => {

    // socket context
    const socket = useSocket()

    // card store
    const activeCardID = useCardStore((state) => state.activeCardID)
    const activeCard = useCardStore((state) => activeCardID ? state.cards[activeCardID] : null)
    const updateCard = useCardStore((state) => state.updateCard)

    if (!activeCardID) {
        return <p>No card selected. Click on a card to edit its properties</p>
    }

    // centralized change handler for input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        updateCard(
            activeCardID!,
            { [name]: parseInt(value) },
            socket
        )
    }

    const handleSave = (e: React.MouseEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget
        updateCard(
            activeCardID!,
            { [name]: parseInt(value) },
            socket,
            true // `isFinal = true` to trigger database save
        )
    }

    const handleReset = (e: React.MouseEvent<HTMLInputElement>) => {        
        // get the name of the property as a key
        const name = e.currentTarget.name as keyof CardItem

        const defaults: Partial<CardItem> = {
            rotation: 0,
            width: -1,
            height: -1,
            opacity: 100
        }

        // use the name key to get the default value from the defaults object
        const defaultValue = defaults[name]

        if (defaultValue !== undefined) {
            updateCard(
                activeCardID!,
                { [name]: defaultValue },
                socket,
                true
            )
        }
    }

    return (
        <>
            <h2>Editing: {activeCard ? activeCard.label : 'None'}</h2>

            <div className="control-panel-controls">
                <p>Position: <PositionDisplay cardID={activeCardID} /></p>

                <p>Rotation: {activeCard?.rotation || 0}°</p>
                <input
                    type="range"
                    name="rotation"
                    min="-360"
                    max="360"
                    value={activeCard?.rotation || 0}
                    onChange={handleChange}
                    onMouseUp={handleSave}
                    onDoubleClick={handleReset}
                />

                <p>Width: </p>
                <input
                    type="range"
                    name="width"
                    min="1"
                    max="1280"
                    value="-1"
                    onChange={handleChange}
                    onMouseUp={handleSave}
                />

                <p>Height: </p>
                <input
                    type="range"
                    name="height"
                    min="1"
                    max="720"
                    value="-1"
                    onChange={handleChange}
                    onMouseUp={handleSave}
                />

                <p>Opacity: {activeCard?.opacity || 100}%</p>
                <input
                    type="range"
                    name="opacity"
                    min="0"
                    max="100"
                    value={activeCard?.opacity || 100}
                    onChange={handleChange}
                    onMouseUp={handleSave}
                    onDoubleClick={handleReset}
                />

                
                <div className="flex-column">
                    <p>Flip: </p>
                    <div className="flex-row">
                        <input 
                            type="checkbox"
                            name="flipX"
                            checked={activeCard?.flipX || false}
                            onChange={handleChange}
                            onMouseUp={handleSave}
                        />
                        <input 
                            type="checkbox"
                            name="flipY"
                            checked={activeCard?.flipY || false}
                            onChange={handleChange}
                            onMouseUp={handleSave}
                        />
                    </div>
                </div>

            </div>
        </>
    )
}

export default ControlPanelControls