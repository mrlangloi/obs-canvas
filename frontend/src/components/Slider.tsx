import type { SliderItem } from '../types/slider'
import styles from './Slider.module.css'

interface Props {
    prop: SliderItem
    hideLabel?: boolean  // set true when a parent already provides the label
}

const Slider = ({ prop, hideLabel = false }: Props) => {
    const { name, label, min, max, value, handleUpdate, handleReset } = prop

    return (
        <div className={`${styles.sliderContainer} ${hideLabel ? 'slider-container-seamless' : ''}`}>
            {!hideLabel && (
                <div className={styles.sliderHeader}>
                    <label className={styles.sliderLabel}>{label}</label>
                    <input
                        className={styles.numberInput}
                        type="number"
                        name={name}
                        value={value}
                        onChange={(e) => handleUpdate(e, true)}
                    />
                </div>
            )}
            {hideLabel && (
                <div className={styles.sliderHeader}>
                    <input
                        className={styles.numberInput}
                        type="number"
                        name={name}
                        value={value}
                        onChange={(e) => handleUpdate(e, true)}
                    />
                </div>
            )}
            <input
                className={styles.slider}
                type="range"
                name={name}
                min={min}
                max={max}
                value={value}
                onChange={(e) => handleUpdate(e)}
                onMouseUp={(e) => handleUpdate(e, true)}
                onDoubleClick={handleReset}
            />
            <span className={styles.sliderHint}>double-click to reset</span>
        </div>
    )
}

export default Slider