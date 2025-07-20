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

interface ShareButtonProps {
  tournament: {
    id: number;
    name: string;
    game_name?: string;
  };
}

const ShareButton: React.FC<ShareButtonProps> = ({ tournament }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const tournamentUrl = `${window.location.origin}/tournaments/${tournament.id}`;
  const gameName = tournament.game_name || "Tournament";
  const shareText = `Check out this amazing ${gameName} tournament: ${tournament.name}! Join now and compete for prizes! 🏆`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tournamentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      tournamentUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(tournamentUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      tournamentUrl
    )}`;
    window.open(linkedinUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${tournamentUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      tournamentUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, "_blank");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          variant="outline"
          size="sm"
          className="bg-black/50 border-[#BBF429]/50 text-white hover:bg-[#BBF429]/20 hover:border-[#BBF429] transition-all duration-200"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 bg-black/90 border-[#BBF429]/30 backdrop-blur-sm p-2"
        align="end"
      >
        <div className="space-y-1">
          <button
            onClick={handleCopyLink}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Link Copied!" : "Copy Link"}
          </button>

          <div className="border-t border-[#BBF429]/30 my-2"></div>

          <button
            onClick={handleFacebookShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <Facebook className="h-4 w-4 mr-2 text-blue-500" />
            Share on Facebook
          </button>

          <button
            onClick={handleTwitterShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
            Share on Twitter
          </button>

          <button
            onClick={handleLinkedInShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
            Share on LinkedIn
          </button>

          <div className="border-t border-[#BBF429]/30 my-2"></div>

          <button
            onClick={handleWhatsAppShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
            Share on WhatsApp
          </button>

          <button
            onClick={handleTelegramShare}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
            Share on Telegram
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
