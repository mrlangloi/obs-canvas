import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'
import useCardStore from '../store/useCardStore'
import SmartMedia from './SmartMedia'

interface Props {
    id: string
    index: number
}

const Card: React.FC<Props> = ({ id, index }) => {

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

    // 
    const cardVisibility = card.visible ? 'card' : 'card streamer-mode'

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
        opacity: `${card.opacity}%`,

        zIndex: index,
        cursor: isDragging ? 'grabbing' : 'grab',
    }

    const contentStyle: React.CSSProperties = {
        rotate: `${card.rotation}deg`,
        width: `${card.width === -1 ? 'auto' : `${card.width}px`}`,
        height: `${card.height === -1 ? 'auto' : `${card.height}px`}`,
        border: isSelected ? '1px solid lime' : card.visible ? '1px solid green' : '1px solid red',
        transform: `scaleX(${card.flipX ? -1 : 1}) scaleY(${card.flipY ? -1 : 1})`,
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
            className={cardVisibility}
            style={wrapperStyle}
            {...listeners}
            {...attributes}
            onMouseDown={handleMouseDown}
        >
            <div style={contentStyle}>
                <p>{card.text}</p>
                {card.mediaType !== 'empty' ? <SmartMedia src={card.url} mediaType={card.mediaType} /> : <></>}
            </div>

        </div>
    )
}

export default Card