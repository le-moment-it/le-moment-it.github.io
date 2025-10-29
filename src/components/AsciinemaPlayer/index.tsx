import React, { useRef, useEffect } from 'react';

// Load asciinema-player from CDN
const AsciinemaPlayer = {
    create: (src: string, element: HTMLElement, options: any) => {
        // We'll load the script dynamically
        return new Promise((resolve) => {
            if (!(window as any).AsciinemaPlayer) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/asciinema-player@3.6.3/dist/bundle/asciinema-player.min.js';
                script.onload = () => {
                    const player = (window as any).AsciinemaPlayer.create(src, element, options);
                    resolve(player);
                };
                document.head.appendChild(script);
            } else {
                const player = (window as any).AsciinemaPlayer.create(src, element, options);
                resolve(player);
            }
        });
    }
};

interface AsciinemaPlayerProps {
    src: string;
    options?: {
        autoPlay?: boolean;
        loop?: boolean | number;
        speed?: number;
        theme?: 'asciinema' | 'dracula' | 'monokai' | 'nord' | 'solarized-dark' | 'solarized-light' | 'tango';
        poster?: string;
        fit?: 'width' | 'height' | 'both' | false;
        controls?: boolean | 'auto';
    };
    className?: string;
    style?: React.CSSProperties;
}

const AsciinemaPlayerComponent: React.FC<AsciinemaPlayerProps> = ({
    src,
    options = {},
    className = '',
    style = {}
}) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const playerInstanceRef = useRef<any>(null);

    useEffect(() => {
        // Load CSS
        if (!document.querySelector('link[href*="asciinema-player.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/asciinema-player@3.6.3/dist/bundle/asciinema-player.css';
            document.head.appendChild(link);
        }

        // Create player
        if (playerRef.current && !playerInstanceRef.current) {
            AsciinemaPlayer.create(src, playerRef.current, options).then((player: any) => {
                playerInstanceRef.current = player;
            });
        }

        return () => {
            if (playerInstanceRef.current && playerInstanceRef.current.dispose) {
                playerInstanceRef.current.dispose();
                playerInstanceRef.current = null;
            }
        };
    }, [src, options]);

    return (
        <div
            ref={playerRef}
            className={`asciinema-player ${className}`}
            style={style}
        />
    );
};

export default AsciinemaPlayerComponent;
