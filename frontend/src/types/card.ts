interface Position {
    x: number
    y: number
}

export interface CardItem {
    id: string
    label: string
    visible: boolean

    text: string
    url: string
    mediaType: string

    position: Position
    rotation?: number
    width?: number
    height?: number
    flipX?: boolean
    flipY?: boolean
    opacity?: number

    zIndex?: number
}