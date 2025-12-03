import * as React from "react";
import { Carousel } from "@ark-ui/react/carousel";

export function ThumbnailsCarousel() {
  const images = React.useMemo(
    () =>
      [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1526967918331-4f7475125bef?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80",
      ].map((url, i) => ({
        full: url,
        thumb: `${url}&w=240&h=160`,
      })),
    [],
  );

  return (
    <Carousel.Root className="mx-auto max-w-3xl p-2">
      <Carousel.Control>
        <Carousel.Viewport>
          <Carousel.ItemGroup className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            {images.map((image, index) => (
              <Carousel.Item key={index} index={index}>
                <img
                  src={image.full}
                  alt={`Event slide ${index + 1}`}
                  className="h-80 w-full object-cover md:h-[22rem]"
                />
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>
        </Carousel.Viewport>
      </Carousel.Control>

      <div className="flex items-center gap-4">
        <Carousel.PrevTrigger className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/15">
          ←
        </Carousel.PrevTrigger>

        <Carousel.IndicatorGroup className="scrollbar-hide flex flex-1 gap-2 overflow-x-auto px-2">
          {images.map((image, index) => (
            <Carousel.Indicator
              key={index}
              index={index}
              className="data-[current]:border-primary data-[current]:ring-primary/40 data-[current]:ring-2 shrink-0 overflow-hidden rounded-md border-2 border-transparent transition-all hover:border-white/40"
            >
              <img
                src={image.thumb}
                alt={`Event thumbnail ${index + 1}`}
                className="h-14 w-20 object-cover md:h-16 md:w-24"
              />
            </Carousel.Indicator>
          ))}
        </Carousel.IndicatorGroup>

        <Carousel.NextTrigger className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/15">
          →
        </Carousel.NextTrigger>
      </div>
    </Carousel.Root>
  );
}


