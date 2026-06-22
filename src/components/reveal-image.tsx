"use client";

import React, { useState, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface RevealImageProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  useImgTag?: boolean;
  revealColor?: string;
  delayMs?: number;
  durationMs?: number;
  wrapperClassName?: string;
}

export function RevealImage({
  src,
  alt,
  useImgTag = false,
  revealColor,
  delayMs = 150,
  durationMs = 800,
  wrapperClassName,
  className,
  onLoad,
  fill,
  width,
  height,
  style,
  ...props
}: RevealImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle cached images
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  // Scroll visibility observer (triggers only once per mount)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it enters the viewport
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  // Determine wrapper styling and classes
  const defaultWrapperClass = fill
    ? "absolute inset-0 overflow-hidden"
    : "relative overflow-hidden inline-block";

  const wrapperStyle: React.CSSProperties = {};
  if (width && !fill) wrapperStyle.width = width;
  if (height && !fill) wrapperStyle.height = height;

  const showReveal = isLoaded && isInView;

  // The sliding curtain overlay style (slides UP to reveal from bottom to top)
  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: revealColor || "var(--surface)",
    transitionProperty: "transform",
    transitionDuration: `${durationMs}ms`,
    transitionDelay: `${delayMs}ms`,
    transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1)",
    transform: showReveal ? "translateY(-100%)" : "translateY(0%)",
    zIndex: 10,
    pointerEvents: "none",
  };

  // Premium parallax-like scale-down animation on the image itself
  const imageStyle: React.CSSProperties = {
    ...style,
    transition: `transform ${durationMs + 200}ms cubic-bezier(0.25, 1, 0.5, 1)`,
    transitionDelay: `${delayMs}ms`,
    transform: showReveal ? "scale(1)" : "scale(1.08)",
  };

  return (
    <div 
      ref={wrapperRef}
      className={`${defaultWrapperClass} ${wrapperClassName || ""}`} 
      style={{ ...style, ...wrapperStyle }}
    >
      {useImgTag ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={className}
          style={{ width: "100%", height: "100%", objectFit: "cover", ...imageStyle }}
          {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
      ) : (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={className}
          fill={fill}
          width={width}
          height={height}
          style={imageStyle}
          {...props}
        />
      )}

      {/* The Reveal Overlay */}
      <div style={overlayStyle} aria-hidden="true" />
    </div>
  );
}
