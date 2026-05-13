import type { SliderItem } from '../types/slider'

const Slider = ({ prop } : { prop: SliderItem }) => {
    const { name, label, min, max, value, onChange, onMouseUp, onDoubleClick } = prop

    return (
        <div className="slider-container">
            <label>{label}</label>
            <input
                type="range"
                name={name}
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                onMouseUp={onMouseUp}
                onDoubleClick={onDoubleClick}
            />
        </div>
    )
}

export default Slider