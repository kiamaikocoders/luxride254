import React, { useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface InfiniteCarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  children,
  className,
  itemClassName,
  autoplay = true,
  autoplayInterval = 4000,
  loop = true,
}) => {
  const [api, setApi] = React.useState<CarouselApi>();

  // Duplicate items for infinite scroll effect
  const duplicatedChildren = loop ? [...children, ...children, ...children] : children;

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || !autoplay) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [api, autoplay, autoplayInterval]);

  // Reset to start when reaching the end (for infinite effect)
  useEffect(() => {
    if (!api || !loop) {
      return;
    }

    const handleSelect = () => {
      const totalSlides = children.length;
      const currentSlide = api.selectedScrollSnap();
      
      // If we're in the last third (duplicated section), reset to first third
      if (currentSlide >= totalSlides * 2) {
        api.scrollTo(totalSlides, false); // false = instant jump, no animation
      }
      // If we're before the first third, jump to middle third
      else if (currentSlide < totalSlides) {
        api.scrollTo(totalSlides + currentSlide, false);
      }
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, loop, children.length]);

  return (
    <div className={cn("w-full", className)}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false, // We handle looping manually for better control
          skipSnaps: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {duplicatedChildren.map((child, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "pl-2 md:pl-4",
                "basis-full sm:basis-1/2 lg:basis-1/3",
                itemClassName
              )}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default InfiniteCarousel;
