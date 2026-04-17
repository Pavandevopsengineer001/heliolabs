"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <Image
          src={activeImage}
          alt={name}
          width={1200}
          height={1400}
          className="h-[560px] w-full object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={cn(
              "overflow-hidden rounded-[1.25rem] border bg-white p-1 transition",
              activeImage === image ? "border-ember" : "border-black/5"
            )}
          >
            <Image
              src={image}
              alt={`${name} detail`}
              width={300}
              height={360}
              className="h-28 w-full rounded-[1rem] object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

