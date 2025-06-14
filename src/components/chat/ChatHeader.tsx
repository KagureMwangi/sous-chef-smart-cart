
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, History, Trash2 } from 'lucide-react';
import { ConversationMessage } from '@/hooks/useConversationHistory';
import RecentRecipes from '../RecentRecipes';

interface ChatHeaderProps {
  recentRecipes: ConversationMessage[];
  conversationLength: number;
  onClearHistory: () => void;
}

const ChatHeader = ({ recentRecipes, conversationLength, onClearHistory }: ChatHeaderProps) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <CardTitle className="gradient-text flex items-center space-x-1 sm:space-x-2 text-base sm:text-lg md:text-2xl min-w-0">
        <Send className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
        <span className="truncate">AI Question Assistant</span>
      </CardTitle>
      
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        {/* Recent Recipes Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="neon-border text-xs sm:text-sm px-2 sm:px-3">
              <History className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Recipes</span> ({recentRecipes.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] mx-2">
            <DialogHeader>
              <DialogTitle className="text-sm sm:text-base">Recent Recipes from AI Assistant</DialogTitle>
            </DialogHeader>
            <ScrollArea className="mt-4 max-h-[60vh]">
              <RecentRecipes recipes={recentRecipes} />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Clear History Button */}
        {conversationLength > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearHistory}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground px-2 sm:px-3"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-1">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
