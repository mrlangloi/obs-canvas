import { useState } from 'react'
import { useSocket } from '../contexts/SocketContext'
import useAuthStore from '../store/useAuthStore'
import useCardStore from '../store/useCardStore'
import PositionDisplay from './PositionDisplay'

const ControlPanel = () => {

    // socket context
    const socket = useSocket()

    // auth store
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const logout = useAuthStore((state) => state.logout)

    // card store
    const cards = useCardStore((state) => state.cards)
    const activeCardID = useCardStore((state) => state.activeCardID)
    const updateCard = useCardStore((state) => state.updateCard)

    const [showPanel, setShowPanel] = useState(true)

    const activeCard = activeCardID ? cards[activeCardID] : null

    const handleLogin = () => {
        // redirect to the backend's twitch auth endpoint
        const backendURL = import.meta.env.VITE_BACKEND_URL
        window.location.href = `${backendURL}/oauth2/authorization/twitch`
    }

    return (
        <aside className={`control-panel ${!showPanel ? 'hidden' : ''}`}>
            <h2 className="control-panel-title">Control Panel</h2>

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
            
            {/* twitch login/logout */}
            {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Welcome, {user?.display_name}</span>
                    {user?.profile_image_url && (
                        <img
                            src={user.profile_image_url}
                            alt="Avatar"
                            style={{ width: '32px', borderRadius: '50%' }}
                        />
                    )}
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <button onClick={handleLogin} style={{ backgroundColor: '#9146FF', color: 'white' }}>
                    Login with Twitch
                </button>
            )}
        </aside>
    )
}

export default ControlPanel