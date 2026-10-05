import type { ElementType } from "react";

type StickerProps = {
  text: string;
  as?: ElementType;
  tone?: "pink" | "ink";
  className?: string;
};

export function Sticker({ text, as: Tag = "h2", tone = "pink", className = "" }: StickerProps) {
  const Element = Tag as ElementType;
  return <Element className={`sticker sticker-${tone} ${className}`.trim()}>{text}</Element>;
}
