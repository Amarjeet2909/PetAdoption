import { useState, useEffect } from "react";

interface ImageCarouselProps {
    images: string[];
    altText: string;
    height?: string;
    rounded?: string;
    interval?: number;
}

export default function ImageCarousel({
    images,
    altText,
    height = "h-48",
    rounded = "rounded-t-2xl",
    interval = 3000
}: ImageCarouselProps) {

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    if (images.length === 0) {
        return (
            <div className={`w-full ${height} ${rounded} bg-orange-50 flex items-center justify-center text-5xl`}>
                🐾
            </div>
        );
    }

    return (
        <div className={`relative w-full ${height} ${rounded} overflow-hidden`}>
            {images.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`${altText} ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain bg-gray-50 transition-opacity duration-700 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            {/* Dots indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => { e.preventDefault(); setCurrentIndex(index); }}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? "bg-orange-500 w-4"
                                    : "bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}