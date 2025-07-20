import React, { useState } from "react";
import {
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ShareButtonSmallProps {
  tournament: {
    id: number;
    name: string;
    game_name?: string;
  };
}

const ShareButtonSmall: React.FC<ShareButtonSmallProps> = ({ tournament }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const tournamentUrl = `${window.location.origin}/tournaments/${tournament.id}`;
  const gameName = tournament.game_name || "Tournament";
  const shareText = `Check out this amazing ${gameName} tournament: ${tournament.name}! Join now and compete for prizes! 🏆`;

  interface ClipboardEvent {
    stopPropagation: () => void;
  }

  const handleCopyLink = async (e: ClipboardEvent): Promise<void> => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(tournamentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      console.error("Failed to copy link:", err);
    }
  };

interface ShareEvent {
    stopPropagation: () => void;
}

const handleFacebookShare = (e: ShareEvent): void => {
    e.stopPropagation();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        tournamentUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
};

  const handleTwitterShare = (e: ShareEvent): void => {
    e.stopPropagation();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(tournamentUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleLinkedInShare = (e: ShareEvent): void => {
    e.stopPropagation();
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      tournamentUrl
    )}`;
    window.open(linkedinUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = (e: ShareEvent): void => {
    e.stopPropagation();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${tournamentUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleTelegramShare = (e: ShareEvent): void => {
    e.stopPropagation();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      tournamentUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, "_blank");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-[#BBF429]/50 text-[#BBF429] hover:bg-[#BBF429]/20 hover:border-[#BBF429] transition-all duration-200 h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }} // Prevent card click
        >
          <Share2 className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-52 bg-black/95 border-[#BBF429]/30 backdrop-blur-sm p-2"
        align="end"
      >
        <div className="space-y-1">
          <button
            onClick={handleCopyLink}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center text-sm"
          >
            {copied ? (
              <Check className="h-3 w-3 mr-2 text-green-400" />
            ) : (
              <Copy className="h-3 w-3 mr-2" />
            )}
            {copied ? "Link Copied!" : "Copy Link"}
          </button>

          <div className="border-t border-[#BBF429]/30 my-1"></div>

          <button
            onClick={handleFacebookShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center text-sm"
          >
            <Facebook className="h-3 w-3 mr-2 text-blue-500" />
            Facebook
          </button>

          <button
            onClick={handleTwitterShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center text-sm"
          >
            <Twitter className="h-3 w-3 mr-2 text-blue-400" />
            Twitter
          </button>

          <button
            onClick={handleLinkedInShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center text-sm"
          >
            <Linkedin className="h-3 w-3 mr-2 text-blue-600" />
            LinkedIn
          </button>

          <div className="border-t border-[#BBF429]/30 my-1"></div>

          <button
            onClick={handleWhatsAppShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center text-sm"
          >
            <MessageCircle className="h-3 w-3 mr-2 text-green-500" />
            WhatsApp
          </button>

          <button
            onClick={handleTelegramShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center text-sm"
          >
            <MessageCircle className="h-3 w-3 mr-2 text-blue-500" />
            Telegram
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButtonSmall;
