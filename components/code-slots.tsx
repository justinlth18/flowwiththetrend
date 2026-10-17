"use client";

import { useRef } from "react";

const length = 6;

export function CodeSlots({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  function write(next: string) {
    onChange(next.replace(/\D/g, "").slice(0, length));
  }

  function focusAt(index: number) {
    inputs.current[Math.max(0, Math.min(length - 1, index))]?.focus();
  }

  return (
    <div
      className="code-slots"
      onPaste={(event) => {
        const text = event.clipboardData.getData("text");
        if (!/\d/.test(text)) return;
        event.preventDefault();
        write(text);
        focusAt(Math.min(length - 1, text.replace(/\D/g, "").length));
      }}
    >
      {digits.map((digit, index) => (
        <input
          key={`${index}-${digit || "blank"}`}
          ref={(node) => {
            inputs.current[index] = node;
          }}
          className={digit ? "code-slot is-filled" : "code-slot"}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1}`}
          value={digit}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.value.replace(/\D/g, "");
            if (!next) {
              write(value.slice(0, index) + value.slice(index + 1));
              return;
            }
            if (next.length > 1) {
              const merged = (value.slice(0, index) + next).slice(0, length);
              write(merged);
              focusAt(Math.min(length - 1, merged.length));
              return;
            }
            const chars = digits.slice();
            chars[index] = next;
            write(chars.join(""));
            if (index < length - 1) focusAt(index + 1);
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              const chars = digits.slice();
              chars[index - 1] = "";
              write(chars.join(""));
              focusAt(index - 1);
            }
            if (event.key === "ArrowLeft") focusAt(index - 1);
            if (event.key === "ArrowRight") focusAt(index + 1);
          }}
          onFocus={(event) => event.currentTarget.select()}
        />
      ))}
    </div>
  );
}
