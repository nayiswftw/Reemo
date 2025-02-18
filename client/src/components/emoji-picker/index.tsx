// EmojiPickerComponent.tsx
import React, { memo, useCallback } from "react";
import Picker from "@emoji-mart/react";

interface EmojiPickerComponentProps {
  onSelectEmoji: (emoji: string) => void;
  theme?: "light" | "dark";
  className?: string;
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = memo(({
  onSelectEmoji,
  theme = "light",
  className = "",
}) => {
  // Handle emoji selection with useCallback for optimization
  const handleEmojiSelect = useCallback((emoji: { native: string }) => {
    onSelectEmoji(emoji.native);
  }, [onSelectEmoji]);

  return (
    <div className={`relative w-full md:w-auto ${className}`}>
      <Picker
        onEmojiSelect={handleEmojiSelect}
        theme={theme}/>
    </div>
  );
});

export default EmojiPickerComponent;
