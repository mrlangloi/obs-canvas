import type React from 'react'
import { useSocket } from '../contexts/SocketContext'
import useCardStore from '../store/useCardStore'
import PositionDisplay from './PositionDisplay'
import type { CardItem } from '../types/card'
import Slider from './Slider'

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
    const handleUpdate = (
        e: React.ChangeEvent<HTMLInputElement 
            | HTMLTextAreaElement>
        | React.MouseEvent<HTMLInputElement>,
        isFinal = false
    ) => {
        if (!activeCardID)
            return

        const target = e.currentTarget
        const { name, value } = target

        let val: string | number | boolean = value

        if (target instanceof HTMLInputElement) {
            if (target.type === 'checkbox') {
                val = target.checked
            } else if (target.type === 'number' || target.type === 'range') {
                val = parseInt(value) || 0
            }
        }

        updateCard(
            activeCardID, 
            { [name]: val },
            socket,
            isFinal
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
                <textarea
                    name="url"
                    value={activeCard?.url || 'Enter media URL..'}
                    onChange={(e) => handleUpdate(e, true)}
                />

                <textarea
                    id="inner-text-input"
                    name="text"
                    value={activeCard?.text || 'Enter text...'}
                    onChange={(e) => handleUpdate(e, true)}
                />
                
                <p>Position: <PositionDisplay cardID={activeCardID} /></p>

                {/* Slider controls */}
                <Slider 
                    prop={{
                        name: "rotation",
                        label: "Rotation",
                        min: -360,
                        max: 360,
                        value: activeCard?.rotation || 0,
                        handleUpdate: handleUpdate,
                        handleReset: handleReset
                    }}
                />

                <Slider
                    prop={{
                        name: "width",
                        label: "Width",
                        min: 1,
                        max: 1280,
                        value: activeCard?.width || -1,
                        handleUpdate: handleUpdate,
                        handleReset: handleReset
                    }}
                />

                <Slider
                    prop={{
                        name: "height",
                        label: "Height",
                        min: 1,
                        max: 720,
                        value: activeCard?.height || -1,
                        handleUpdate: handleUpdate,
                        handleReset: handleReset
                    }}
                />

                <Slider
                    prop={{
                        name: "opacity",
                        label: "Opacity",
                        min: 0,
                        max: 100,
                        value: activeCard?.opacity || 100,
                        handleUpdate: handleUpdate,
                        handleReset: handleReset
                    }}
                />

                <div className="flex-column">
                    <p>Flip: </p>
                    <div className="flex-row">
                        <input 
                            type="checkbox"
                            name="flipX"
                            checked={activeCard?.flipX || false}
                            onChange={(e) => handleUpdate(e, true)}
                        />
                        <input 
                            type="checkbox"
                            name="flipY"
                            checked={activeCard?.flipY || false}
                            onChange={(e) => handleUpdate(e, true)}
                        />
                    </div>
                </div>

            </div>
        </>
    )
}

export default ControlPanelControls