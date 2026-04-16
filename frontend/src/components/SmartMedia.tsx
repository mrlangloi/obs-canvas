import React, { useState, useEffect, useRef } from 'react';

interface SmartMediaProps {
    src: string;
    mediaType: string;
}

const SmartMedia: React.FC<SmartMediaProps> = ({ src, mediaType }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // we use isIntersecting to mount/unmount the heavy media
                setIsVisible(entry.isIntersecting);
            },
            {
                rootMargin: '400px', // start loading earlier for videos
                threshold: 0.01
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return (() =>
            observer.disconnect()
        )

    }, [])

    return (
        <div ref={containerRef} style={{ minHeight: '150px', width: '100%', background: '#222' }}>
            {isVisible ? (
                mediaType === 'video' ? (
                    <video
                        src={src}
                        muted
                        loop
                        autoPlay
                        playsInline
                        style={{ width: '100%', display: 'block' }}
                    />
                ) : (
                    <img 
                        src={src} 
                        style={{ 
                            width: '100%', 
                            display: 'block' 
                        }} 
                    />
                )
            ) : (
                <div style={{ padding: '20px', color: '#666' }}>Loading...</div>
            )}
        </div>
    )
}

export default SmartMedia