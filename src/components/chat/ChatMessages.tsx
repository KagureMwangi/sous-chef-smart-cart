
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';
import { ConversationMessage } from '@/hooks/useConversationHistory';
import ChatMessage from './ChatMessage';

interface ChatMessagesProps {
  conversation: ConversationMessage[];
  isLoading: boolean;
  userId?: string;
  onSaveRecipe?: (recipe: ConversationMessage) => void;
}

const ChatMessages = ({ conversation, isLoading, userId, onSaveRecipe }: ChatMessagesProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversation, isLoading]);

  return (
    <div className="flex-1 min-h-0 mb-4">
      <ScrollArea ref={scrollAreaRef} className="h-full border rounded-lg bg-background/50">
        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 sm:py-8">
              <Bot className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">Ask me anything! I can help with cooking, meal planning, and recipes based on what you have in your pantry.</p>
              <p className="text-xs sm:text-sm mt-2 opacity-75">I have access to your pantry items and dietary restrictions to give you personalized advice.</p>
            </div>
          ) : (
            conversation.map((item) => (
              <ChatMessage
                key={item.id}
                message={item}
                userId={userId}
                onSaveRecipe={onSaveRecipe}
              />
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="flex-shrink-0">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-muted-foreground">AI is thinking and checking your pantry...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;
