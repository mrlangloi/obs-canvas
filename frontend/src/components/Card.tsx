import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'
import useCardStore from '../store/useCardStore'
import SmartMedia from './SmartMedia'

interface Props {
    id: string
}

const Card: React.FC<Props> = ({ id }) => {

    // import from store
    const card = useCardStore((state) => state.cards[id])
    const activeCardID = useCardStore((state) => state.activeCardID)
    const setActiveCardID = useCardStore((state) => state.setActiveCardID)

    const isSelected = activeCardID === card.id

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: card.id,
    })

    if (!card)
        return null

    // const getMediaType = (url: string) => {
    //     const extension = url.split('.').pop()?.toLowerCase();
    //     if (extension) {
    //         const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'avif'];
    //         const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    //         if (imageExtensions.includes(extension)) {
    //             return 'image';
    //         } else if (videoExtensions.includes(extension)) {
    //             return 'video';
    //         } else {
    //             return 'empty';
    //         }
    //     }
    // }

    /*
        wrapperStyle handles the position during dragging
        contentStyle handles the rotation, opacity, etc.
        if not separated, dragging with rotation applied moves the card with respect to the rotated axes
    */
    const wrapperStyle: React.CSSProperties = {
        position: 'absolute',
        top: card.position.y,
        left: card.position.x,
        // transform during mouse-drag
        transform: CSS.Translate.toString(transform),
        // zIndex: isDragging ? 999 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    }

    const contentStyle: React.CSSProperties = {
        rotate: `${card.rotation}deg`,
        // opacity: isDragging ? 0.8 : 1,
        padding: '8px',
        border: isSelected ? '1px solid green' : '1px solid red',
        color: 'white',
        userSelect: 'none',
    }

    const handleMouseDown = () => {
        if (isSelected) 
            return

        setActiveCardID(card.id)
    }

    return (
        <div
            ref={setNodeRef}
            style={wrapperStyle}
            {...listeners}
            {...attributes}
            onMouseDown={handleMouseDown}
        >
            <div style={contentStyle}>
                {card.text}
                {card.mediaType !== 'empty' ? <SmartMedia src={card.url} mediaType={card.mediaType} /> : <></>}
            </div>

        </div>
    )
}

export default Card