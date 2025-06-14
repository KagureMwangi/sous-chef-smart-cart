
import React from 'react';
import { Bot, User, Send } from 'lucide-react';
import { ConversationMessage } from '@/hooks/useConversationHistory';
import RecipeActions from '../RecipeActions';

interface ChatMessageProps {
  message: ConversationMessage;
  userId?: string;
  onSaveRecipe?: (recipe: ConversationMessage) => void;
}

const ChatMessage = ({ message, userId, onSaveRecipe }: ChatMessageProps) => {
  return (
    <div className="flex items-start space-x-2 sm:space-x-3">
      <div className="flex-shrink-0">
        {message.type === 'user' ? (
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
        ) : (
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
        )}
      </div>
      <div className={`flex-1 rounded-lg p-2 sm:p-3 break-words ${
        message.type === 'user' 
          ? 'bg-blue-50 dark:bg-blue-900/20' 
          : 'bg-gray-50 dark:bg-gray-800'
      }`}>
        <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.message}</p>
        {message.containsRecipe && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
              <Send className="h-3 w-3 mr-1" />
              Recipe
            </span>
          </div>
        )}
        {/* Recipe Actions */}
        {message.type === 'bot' && message.containsRecipe && userId && onSaveRecipe && (
          <RecipeActions 
            recipe={message} 
            onSaveRecipe={onSaveRecipe}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
