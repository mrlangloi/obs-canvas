export interface SliderItem {
    name: string
    label: string

    min: number
    max: number
    value: number

    handleUpdate: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | React.MouseEvent<HTMLInputElement>, isFinal?: boolean) => void
    handleReset: (e: React.MouseEvent<HTMLInputElement>) => void
}