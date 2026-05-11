import { useSocket } from '../contexts/SocketContext'
import useCardStore from '../store/useCardStore'
import PositionDisplay from './PositionDisplay'

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
    const handleChange = (e) => {
        const { name, value } = e.target
        updateCard(
            activeCardID!,
            { [name]: value },
            socket
        )
    }

    const handleSave = (e) => {
        const { name, value } = e.target
        updateCard(
            activeCardID!,
            { [name]: value },
            socket,
            true // `isFinal = true` to trigger database save
        )
    }

    return (
        <>
            <h2>Editing: {activeCard ? activeCard.label : 'None'}</h2>

            <div className="control-panel-controls">
                <p>Position: <PositionDisplay cardID={activeCardID} /></p>

                <p>Rotation: {activeCard?.rotation || 0}°</p>
                <input
                    type="range"
                    min="-360"
                    max="360"
                    value={activeCard?.rotation || 0}
                    onChange={handleChange}
                    onMouseUp={handleSave}
                />

                <p>Width: </p>
                <input
                    type="range"
                    min="1"
                    max="1280"
                    value="-1"
                    onChange={handleChange}
                    onMouseUp={handleSave}
                />

                <p>Height: </p>
                <input
                    type="range"
                    min="1"
                    max="720"
                    value="-1"
                    onChange={handleChange}
                    onMouseUp={handleSave}
                />

                <p>Opacity: {activeCard?.opacity || 100}%</p>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeCard?.opacity || 100}
                    onChange={handleChange}
                    onMouseUp={handleSave}
                />

            </div>
        </>
    )
}

export default ControlPanelControls