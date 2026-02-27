import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Position {
    x: number;
    y: number;
}

export interface CanvasItem {
    id: number;      // Unique identifier (e.g., 'webcam-1')
    position: Position; // The current top/left on the 1080p canvas
    label: string;   // Display name (e.g., 'Webcam')
}

interface Props {
    item: CanvasItem
}

const DraggableItem: React.FC<Props> = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
    })

    const style: React.CSSProperties = {
        // 1. Fixed absolute position from state
        position: 'absolute',
        top: item.position.y,
        left: item.position.x,

        // 2. Dynamic transform during drag (handled by GPU)
        transform: CSS.Translate.toString(transform),

        // 3. Visual Polish
        zIndex: isDragging ? 999 : 1,
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        padding: '12px',
        borderRadius: '4px',
        border: '2px solid white',
        color: 'white',
        boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.3)' : 'none',
        userSelect: 'none',
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {item.label}
        </div>
    )
}

export default DraggableItem