export interface SliderItem {
    name: string
    label: string

    min: number
    max: number
    value: number

    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void
    handleDoubleClick: (e: React.MouseEvent<HTMLInputElement>) => void
}