import { ReactNode, useEffect, useRef, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

interface CarouselProps {
    slides: ReactNode[];
}

export default function Carousel({ slides }: CarouselProps) {
    const [current, setCurrent] = useState(1); // start from 1 (first real slide)
    const [isTransitioning, setIsTransitioning] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalSlides = slides.length;
    const extendedSlides = [slides[totalSlides - 1], ...slides, slides[0]]; // [last, ...original, first]

    const nextSlide = () => {
        setCurrent((prev) => prev + 1);
    };

    const previousSlide = () => {
        setCurrent((prev) => prev - 1);
    };

    // Handle looping after transition
    useEffect(() => {
        if (!containerRef.current) return;

        const handleTransitionEnd = () => {
            setIsTransitioning(false);
            if (current === 0) {
                setCurrent(totalSlides);
            } else if (current === totalSlides + 1) {
                setCurrent(1);
            }
        };

        const ref = containerRef.current;
        ref.addEventListener('transitionend', handleTransitionEnd);

        return () => ref.removeEventListener('transitionend', handleTransitionEnd);
    }, [current, totalSlides]);

    // Re-enable transition after jump
    useEffect(() => {
        if (!isTransitioning) {
            const id = setTimeout(() => setIsTransitioning(true), 20); // wait a bit before re-enabling
            return () => clearTimeout(id);
        }
    }, [isTransitioning]);

    return (
        <div className="relative w-full overflow-hidden">
            <div
                ref={containerRef}
                className={`flex ${isTransitioning ? 'transition-transform duration-300 ease-out' : ''}`}
                style={{
                    transform: `translateX(-${current * (100 / extendedSlides.length)}%)`,
                    width: `${extendedSlides.length * 100}%`,
                }}
            >
                {extendedSlides.map((slide, index) => (
                    <div key={index} className="flex-shrink-0" style={{ width: `${100 / extendedSlides.length}%` }}>
                        {slide}
                    </div>
                ))}
            </div>

            <div className="absolute top-0 flex h-full w-full items-center justify-between px-10 text-3xl text-white">
                <button onClick={previousSlide} className="cursor-pointer rounded-full border-2 border-indigo-700 p-3 hover:bg-white/35">
                    <IoIosArrowBack className="size-5 text-indigo-700" />
                </button>
                <button onClick={nextSlide} className="cursor-pointer rounded-full border-2 border-indigo-700 p-3 hover:bg-white/35">
                    <IoIosArrowBack className="size-5 scale-x-[-1] text-indigo-700" />
                </button>
            </div>
        </div>
    );
}
