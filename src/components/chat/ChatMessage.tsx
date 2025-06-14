
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
    <div className="flex items-start space-x-1 sm:space-x-2 md:space-x-3">
      <div className="flex-shrink-0 pt-1">
        {message.type === 'user' ? (
          <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-500" />
        ) : (
          <Bot className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-500" />
        )}
      </div>
      <div className={`flex-1 rounded-lg p-2 sm:p-3 break-words min-w-0 ${
        message.type === 'user' 
          ? 'bg-blue-50 dark:bg-blue-900/20' 
          : 'bg-gray-50 dark:bg-gray-800'
      }`}>
        <p className="text-xs sm:text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere leading-relaxed">
          {message.message}
        </p>
        {message.containsRecipe && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
              <Send className="h-3 w-3 mr-1 flex-shrink-0" />
              Recipe
            </span>
          </div>
        )}
        {/* Recipe Actions */}
        {message.type === 'bot' && message.containsRecipe && userId && onSaveRecipe && (
          <div className="mt-2">
            <RecipeActions 
              recipe={message} 
              onSaveRecipe={onSaveRecipe}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
