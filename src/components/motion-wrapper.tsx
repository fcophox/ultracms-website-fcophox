"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export function MotionDiv({ children, ...props }: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{children}</motion.div>;
}

export function MotionH1({ children, ...props }: HTMLMotionProps<"h1">) {
  return <motion.h1 {...props}>{children}</motion.h1>;
}

export function MotionP({ children, ...props }: HTMLMotionProps<"p">) {
  return <motion.p {...props}>{children}</motion.p>;
}

export function MotionSpan({ children, ...props }: HTMLMotionProps<"span">) {
  return <motion.span {...props}>{children}</motion.span>;
}
