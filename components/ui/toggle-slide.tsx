"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TogleSlideProps } from "@/types/type";
import Text from "./text";

export const useSyncedSlide = (
  slides: string[],
  defaultSlide: string,
  paramKey?: string
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(() => {
    const fromUrl = searchParams.get(paramKey || "slide");
    return slides.includes(fromUrl || "") ? (fromUrl as string) : defaultSlide;
  }, [searchParams, paramKey, slides, defaultSlide]);

  const [activeSlide, setActiveSlide] = useState(initial);

  // console.log(paramKey);

  // keep state in sync if URL changes (e.g., back/forward)
  useEffect(() => {
    const current = searchParams.get(paramKey || "slide");
    if (current && slides.includes(current) && current !== activeSlide) {
      setActiveSlide(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateUrl = (next: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set(paramKey || "slide", next);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const setSlide = (next: string) => {
    setActiveSlide(next);
    updateUrl(next);
  };

  return { activeSlide, setSlide };
};

const TogleSlide = ({
  slides,
  activeSlide,
  onSlideChange,
}: TogleSlideProps) => {
  return (
    <div>
      <div className="flex items-center gap-3 border-b border-gray-200 px-1">
        {slides.map((slide, i) => {
          const isActive =
            activeSlide.includes(slide.split(" ")[0]) || activeSlide === slide;
          return (
            <div
              key={i}
              onClick={() => onSlideChange?.(slide)}
              className={`cursor-pointer px-4 text-sm ${
                isActive
                  ? "border-primary-500 border-b-2"
                  : "border-transparent"
              }`}
            >
              <Text.Paragraph className="font-semibold">{slide}</Text.Paragraph>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TogleSlide;
