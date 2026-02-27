import React, { useState } from 'react'
import TwitchEmbed from './TwitchEmbed'
import { DndContext, useDraggable, DragOverlay, type DragEndEvent } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import './Canvas.modules.css'
import DraggableItem from './DraggableItem';
import type { CanvasItem } from './DraggableItem';

const Canvas = () => {

    const [items, setItems] = useState<CanvasItem[]>([
        { id: 1, position: { x: 50, y: 50 }, label: "test 1" },
        { id: 2, position: { x: 200, y: 150 }, label: "test 2" },
    ])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;

        setItems((prev) => {
            const updatedItems = [...prev];
            const index = updatedItems.findIndex(item => item.id === active.id);
            if (index !== -1) {
                updatedItems[index] = {
                    ...updatedItems[index],
                    position: {
                        x: updatedItems[index].position.x + delta.x,
                        y: updatedItems[index].position.y + delta.y,
                    }
                };
            }
            return updatedItems;
        })
    }

    return (
        <main className="main-canvas">
            <DndContext modifiers={[restrictToParentElement]} onDragEnd={handleDragEnd}>
                {Object.values(items).map((item) => (
                    <DraggableItem key={item.id} item={item} />
                ))}
            </DndContext>
            <TwitchEmbed />
        </main>
    )
}

export default Canvas