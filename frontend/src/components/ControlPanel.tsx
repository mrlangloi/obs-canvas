import { useEffect, useState } from 'react'

import useAuthStore from '../store/useAuthStore'
import useCardStore from '../store/useCardStore'
import ControlPanelControls from './ControlPanelControls'


const ControlPanel = () => {

    // auth store
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const user = useAuthStore((state) => state.user)
    const isAuthorized = useAuthStore((state) => state.user?.isAuthorized)
    const logout = useAuthStore((state) => state.logout)

    const [showPanel, setShowPanel] = useState(true)

    useEffect(() => {
        if (isLoggedIn) {
            console.log("Twitch login data:", user);
        }
    }, [isLoggedIn, user])

    const handleLogin = () => {
        // redirect to the backend's twitch auth endpoint
        const backendURL = import.meta.env.VITE_BACKEND_URL
        window.location.href = `${backendURL}/oauth2/authorization/twitch`
    }

    return (
        <aside className={`control-panel ${!showPanel ? 'hidden' : ''}`}>
            {/* twitch login/logout */}
            {isLoggedIn ? (
                <div className="twitch-user">
                    <div className="twitch-user-profile">
                        {user?.profile_image_url && (
                            <img
                                src={user.profile_image_url}
                                alt="Avatar"
                                style={{ width: '32px', borderRadius: '50%' }}
                            />
                        )}
                        <span>{user?.display_name}</span>
                    </div>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <button onClick={handleLogin} style={{ backgroundColor: '#9146FF', color: 'white' }}>
                    Login with Twitch
                </button>
            )}

            <h2 className="control-panel-title">Control Panel</h2>

            {isAuthorized ? (
                <ControlPanelControls />
            ) : (
                <p>
                    This account is not authorized to use this app. Please log in with a Twitch account that has moderator privileges in the current Twitch channel.
                </p>
            )}

            <button className="toggle-tab" onClick={() => setShowPanel(!showPanel)}>
                {showPanel ? '◀' : '▶'}
            </button>


        </aside>
    )
}

export default ControlPanel