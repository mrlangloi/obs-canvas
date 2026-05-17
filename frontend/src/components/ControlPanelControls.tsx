import type React from 'react'
import { useSocket } from '../contexts/SocketContext'
import useCardStore from '../store/useCardStore'
import PositionDisplay from './PositionDisplay'
import type { CardItem } from '../types/card'
import Slider from './Slider'
import styles from './ControlPanelControls.module.css'

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

    // -1 is the sentinel value Card.tsx uses to mean "auto"
    const isWidthAuto = (activeCard?.width ?? -1) === -1
    const isHeightAuto = (activeCard?.height ?? -1) === -1

    const handleAutoToggle = (dimension: 'width' | 'height', currentlyAuto: boolean) => {
        // toggling ON sets -1 so Card.tsx uses "auto"
        // toggling OFF sets it to the card's current dimension
        const value = currentlyAuto ? -1 : (dimension === 'width' ? 640 : 360)
        updateCard(activeCardID!, { [dimension]: value }, socket, true)
    }


    const sliderConfig = [
        {
            name: "rotation",
            label: "Rotation",
            min: -360,
            max: 360,
            value: activeCard?.rotation || 0,
            handleUpdate: handleUpdate,
            handleReset: handleReset
        },
        {
            name: "opacity",
            label: "Opacity",
            min: 0,
            max: 100,
            value: activeCard?.opacity || 100,
            handleUpdate: handleUpdate,
            handleReset: handleReset
        }
    ]

    return (
        <div className={styles.controls}>

            {/* Active card indicator */}
            <div className={styles.editingLabel}>
                <span className={styles.editingDot} />
                <span className={styles.editingText}>
                    Editing&nbsp;<span className={styles.editingName}>{activeCard?.label ?? 'Card'}</span>
                </span>
            </div>

            {/* Media URL */}
            <span className={styles.sectionDivider}>Media</span>
            <div className={styles.textareaRow}>
                <span className={styles.controlLabel}>URL</span>
                <textarea
                    className={styles.textarea}
                    name="url"
                    value={activeCard?.url || ''}
                    placeholder="Enter media URL..."
                    onChange={(e) => handleUpdate(e, true)}
                />
            </div>

            {/* Inner text */}
            <div className={styles.textareaRow}>
                <span className={styles.controlLabel}>Text</span>
                <textarea
                    className={styles.textarea}
                    id="inner-text-input"
                    name="text"
                    value={activeCard?.text || ''}
                    placeholder="Enter text..."
                    onChange={(e) => handleUpdate(e, true)}
                />
            </div>

            {/* Position */}
            <span className={styles.sectionDivider}>Transform</span>
            <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Position</span>
                <div className={styles.positionRow}>
                    <PositionDisplay cardID={activeCardID} />
                </div>
            </div>

            {/* Width */}
            <div className={styles.dimensionRow}>
                <div className={styles.dimensionHeader}>
                    <span className={styles.controlLabel}>Width</span>
                    <label className={styles.autoToggle}>
                        <input
                            className={styles.checkbox}
                            type="checkbox"
                            checked={isWidthAuto}
                            onChange={() => handleAutoToggle('width', !isWidthAuto)}
                        />
                        <span className={styles.autoToggleLabel}>Auto</span>
                    </label>
                </div>
                {!isWidthAuto && (
                    <Slider
                        prop={{
                            name: "width",
                            label: "Width",
                            min: 1,
                            max: 1280,
                            value: activeCard?.width ?? 640,
                            handleUpdate,
                            handleReset
                        }}
                        hideLabel
                    />
                )}
            </div>

            {/* Height */}
            <div className={styles.dimensionRow}>
                <div className={styles.dimensionHeader}>
                    <span className={styles.controlLabel}>Height</span>
                    <label className={styles.autoToggle}>
                        <input
                            className={styles.checkbox}
                            type="checkbox"
                            checked={isHeightAuto}
                            onChange={() => handleAutoToggle('height', !isHeightAuto)}
                        />
                        <span className={styles.autoToggleLabel}>Auto</span>
                    </label>
                </div>
                {!isHeightAuto && (
                    <Slider
                        prop={{
                            name: "height",
                            label: "Height",
                            min: 1,
                            max: 720,
                            value: activeCard?.height ?? 360,
                            handleUpdate,
                            handleReset
                        }}
                        hideLabel
                    />
                )}
            </div>

            {/* Sliders */}
            {sliderConfig.map((config) => (
                <Slider key={config.name} prop={config} />
            ))}

            {/* Flip */}
            <span className={styles.sectionDivider}>Flip</span>
            <div className={styles.flipRow}>
                <div className={styles.flipOptions}>
                    <label className={styles.flipOption}>
                        <span className={styles.flipOptionLabel}>Horizontal</span>
                        <input
                            className={styles.checkbox}
                            type="checkbox"
                            name="flipX"
                            checked={activeCard?.flipX || false}
                            onChange={(e) => handleUpdate(e, true)}
                        />
                    </label>
                    <label className={styles.flipOption}>
                        <span className={styles.flipOptionLabel}>Vertical</span>
                        <input
                            className={styles.checkbox}
                            type="checkbox"
                            name="flipY"
                            checked={activeCard?.flipY || false}
                            onChange={(e) => handleUpdate(e, true)}
                        />
                    </label>
                </div>
            </div>

        </div>
    )
}

export default ControlPanelControls

