import type { SliderItem } from '../types/slider'

const Slider = ({ prop } : { prop: SliderItem }) => {
    const { name, label, min, max, value, handleUpdate, handleReset } = prop

    return (
        <div className="slider-container">
            <div className="slider-label">
                <label>{label}: </label>
                <input
                    className="number-input"
                    type="number"
                    value={value}
                    onChange={(e) => handleUpdate(e, true)}
                />
            </div>
            {/* <p>{label}: {value}</p> */}
            <input
                type="range"
                name={name}
                min={min}
                max={max}
                value={value}
                onChange={(e) => handleUpdate(e)}
                onMouseUp={(e) => handleUpdate(e, true)}
                onDoubleClick={handleReset}
            />
        </div>
    )
}

export default Slider