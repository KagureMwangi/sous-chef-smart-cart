
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
    <div className="flex justify-between items-center">
      <CardTitle className="gradient-text flex items-center space-x-2 text-lg sm:text-2xl">
        <Send className="h-5 w-5 sm:h-6 sm:w-6" />
        <span>AI Question Assistant</span>
      </CardTitle>
      
      <div className="flex items-center space-x-2">
        {/* Recent Recipes Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="neon-border">
              <History className="h-4 w-4 mr-1" />
              Recipes ({recentRecipes.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Recent Recipes from AI Assistant</DialogTitle>
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
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
