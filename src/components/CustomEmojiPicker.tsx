import React, { useState } from "react";
import { Box, Button, HStack, Icon, VStack } from "@chakra-ui/react";
import { Plus } from "@untitled-ui/icons-react";
import EmojiPicker from "emoji-picker-react";

const popularEmojis = [
  "😀",
  "😂",
  "😍",
  "😎",
  "😊",
  "😢",
  "😡",
  "👍",
  "🙏",
  "🎉",
];

const CustomEmojiPicker = ({ onEmojiClick }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <Box>
      {showAll ? (
        <EmojiPicker onEmojiClick={onEmojiClick} />
      ) : (
        <VStack spacing={2}>
          <HStack spacing={2}>
            {popularEmojis.map((emoji, index) => (
              <Button
                key={index}
                onClick={() => onEmojiClick(null, { emoji })}
                fontSize="24px"
                variant="ghost"
              >
                {emoji}
              </Button>
            ))}
            <Button onClick={() => setShowAll(true)} variant="ghost">
              <Icon as={Plus} w={6} h={6} />
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default CustomEmojiPicker;
