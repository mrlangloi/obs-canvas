import type { SliderItem } from '../types/slider'

const Slider = ({ prop } : { prop: SliderItem }) => {
    const { name, label, min, max, value, handleChange, handleMouseUp, handleDoubleClick } = prop

    return (
        <div className="slider-container">
            <div className="slider-label">
                <label>{label}: </label>
                <input
                    className="number-input"
                    type="number"
                    value={value}
                    onChange={handleChange}
                />
            </div>
            {/* <p>{label}: {value}</p> */}
            <input
                type="range"
                name={name}
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                onMouseUp={handleMouseUp}
                onDoubleClick={handleDoubleClick}
            />
        </div>
    )
}

export default Slider