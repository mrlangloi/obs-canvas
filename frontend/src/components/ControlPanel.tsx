import { useState } from 'react';
import { useCards } from '../contexts/CardContext';

const ControlPanel = () => {
    const { cards, activeCardID, cardsRef, updateCard } = useCards();

    const [showPanel, setShowPanel] = useState(true)

    const activeCard = cardsRef.current.find(card => card.id === activeCardID)

    return (
        <aside className={`control-panel ${!showPanel ? 'hidden' : ''}`}>
            <h2>Editing: {activeCard ? activeCard.label : 'None'}</h2>
            
            <div className="control-panel-controls">
                <input
                    type="range"
                    min="-360"
                    max="360"
                    value={activeCard?.rotation || 0}
                    onChange={(e) => updateCard(activeCardID!, { rotation: parseInt(e.target.value) })}
                />
            </div>
            <button className="toggle-tab" onClick={() => setShowPanel(!showPanel)}>
                {showPanel ? '◀' : '▶'}
            </button>
            <h2 className="control-panel-title">Control Panel</h2>
        </aside>
    );
};

export default ControlPanel;