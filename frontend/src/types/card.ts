interface Position {
    x: number
    y: number
}

export interface CardItem {
    id: string
    position: Position
    label: string
    text: string
    url: string
    mediaType: string
    rotation?: number
    width?: number
    height?: number
    opacity?: number
    zIndex?: number
}