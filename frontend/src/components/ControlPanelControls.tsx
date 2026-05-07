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
        </>
    )
}

export default ControlPanelControls