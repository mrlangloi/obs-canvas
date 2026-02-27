import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Position {
    x: number
    y: number
}

export interface CardItem {
    id: number
    position: Position
    label: string
    text: string
    rotation?: number
    opacity?: number
    zIndex?: number
}

interface Props {
    card: CardItem
}

const Card: React.FC<Props> = ({ card }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: card.id,
    })

    const style: React.CSSProperties = {
        position: 'absolute',
        top: card.position.y,
        left: card.position.x,

        // transform during mouse-drag
        transform: CSS.Translate.toString(transform),

        // zIndex: isDragging ? 999 : 1,
        // opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        padding: '8px',
        border: '1px solid white',
        color: 'white',
        userSelect: 'none',
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {card.text}
        </div>
    )
}

export default Card