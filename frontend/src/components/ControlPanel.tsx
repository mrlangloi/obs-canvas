import { useEffect, useState } from 'react'
import useAuthStore from '../store/useAuthStore'
import ControlPanelControls from './ControlPanelControls'
import styles from './ControlPanel.module.css'

const ControlPanel = () => {

    // auth store
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const user = useAuthStore((state) => state.user)
    // const isAuthorized = useAuthStore((state) => state.user?.isAuthorized)
    const logout = useAuthStore((state) => state.logout)

    const [showPanel, setShowPanel] = useState(true)

    useEffect(() => {
        if (isLoggedIn) {
            console.log("Twitch login data:", user)
        }
    }, [isLoggedIn, user])

    // const handleLogin = () => {
    //     // redirect to the backend's twitch auth endpoint
    //     const backendURL = import.meta.env.VITE_BACKEND_URL
    //     window.location.assign(`${backendURL}/oauth2/authorization/twitch`)
    // }

    return (
        <aside className={`${styles.panel} ${!showPanel ? styles.hidden : ''}`}>

            <div className={styles.header}>
                <div className={styles.wordmark}>
                    <div className={styles.wordmarkIcon}>
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="1" y="1" width="5" height="5" rx="1"/>
                            <rect x="8" y="1" width="5" height="5" rx="1"/>
                            <rect x="1" y="8" width="5" height="5" rx="1"/>
                            <rect x="8" y="8" width="5" height="5" rx="1"/>
                        </svg>
                    </div>
                    <span className={styles.wordmarkText}>OBS Canvas</span>
                </div>

                <div className={styles.auth}>
                    {/* twitch login/logout */}
                    {isLoggedIn ? (
                        <div className={styles.userCard}>
                            {user?.profile_image_url ? (
                                <img className={styles.avatar} src={user.profile_image_url} alt="Avatar" />
                            ) : (
                                <div className={styles.avatarPlaceholder}>◎</div>
                            )}
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{user?.display_name}</div>
                                <div className={styles.userBadge}>
                                    <span className={styles.badgeDot} />
                                    Connected
                                </div>
                            </div>
                            <button className={`${styles.btn} ${styles.btnGhost}`} onClick={logout}>
                                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 7h7M9 4.5l2.5 2.5L9 9.5"/>
                                    <path d="M9 2H3a1 1 0 00-1 1v8a1 1 0 001 1h6"/>
                                </svg>
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <a href={`${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/twitch`}>
                            <button className={`${styles.btn} ${styles.btnTwitch}`}>
                                <svg viewBox="0 0 14 14" fill="currentColor">
                                    <path d="M2 1L1 3v9h3v2h2l2-2h2l3-3V1H2zm9 8l-2 2H7l-2 2v-2H2V2h9v7zM9 4H8v3h1V4zm-2.5 0H5.5v3h1V4z"/>
                                </svg>
                                Continue with Twitch
                            </button>
                        </a>
                    )}
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.sectionLabel}>Controls</div>

            <div className={styles.body}>
                {/* {isAuthorized ? (
                    <ControlPanelControls />
                ) : (
                    <p className={styles.notice}>
                        {isLoggedIn
                            ? "This account doesn't have moderator access to this channel."
                            : "Sign in with Twitch to access canvas controls."}
                    </p>
                )} */}
                <ControlPanelControls />
            </div>

            <button className={styles.toggle} onClick={() => setShowPanel(!showPanel)}>
                {showPanel ? '◀' : '▶'}
            </button>

        </aside>
    )
}

export default ControlPanel