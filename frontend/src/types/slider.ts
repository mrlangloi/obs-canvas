export interface SliderItem {
    name: string
    label: string

    min: number
    max: number
    value: number

    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void
    onDoubleClick: (e: React.MouseEvent<HTMLInputElement>) => void
}