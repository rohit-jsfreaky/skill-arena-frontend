import React, { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Screenshot } from "@/hooks/useUserTournamentResult";

interface ShareButtonProps {
  tournament: {
    id: number;
    name: string;
    game_name?: string;
    prize_pool?: number;
  };
  userScreenshot: Screenshot;
}

const ShareButton: React.FC<ShareButtonProps> = ({ tournament, userScreenshot }) => {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const gameName = tournament.game_name || "Tournament";
  const prizeAmount = tournament.prize_pool ? `₹${tournament.prize_pool}` : "Prize";

  // Generate sharing image with tournament details and user screenshot
  const generateSharingImage = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(null);
        return;
      }

      // Set canvas size for social media (1200x630 - optimal for Facebook/Twitter)
      canvas.width = 1200;
      canvas.height = 630;

      try {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.5, '#1a1a1a');
        gradient.addColorStop(1, '#BBF429');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load and draw user screenshot
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            // Draw screenshot on right side
            const imgWidth = 400;
            const imgHeight = 300;
            const imgX = canvas.width - imgWidth - 50;
            const imgY = (canvas.height - imgHeight) / 2;
            
            ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

            // Add text content
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px Arial, sans-serif';
            ctx.fillText('🏆 Tournament Result!', 50, 120);
            
            ctx.font = '36px Arial, sans-serif';
            ctx.fillText(tournament.name.length > 25 ? tournament.name.substring(0, 25) + '...' : tournament.name, 50, 200);
            
            ctx.font = '28px Arial, sans-serif';
            ctx.fillStyle = '#BBF429';
            ctx.fillText(`Game: ${gameName}`, 50, 250);
            ctx.fillText(`Prize: ${prizeAmount}`, 50, 300);
            
            ctx.fillStyle = '#CCCCCC';
            ctx.font = '24px Arial, sans-serif';
            ctx.fillText('Status: Screenshot Submitted ✅', 50, 400);
            ctx.fillText('Join tournaments at Skill Arena!', 50, 450);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
              resolve(blob);
            }, 'image/png', 0.9);
          } catch (error) {
            console.error('Error drawing image:', error);
            // Fallback to text-only version
            createTextOnlyVersion();
          }
        };
        
        img.onerror = () => {
          // If image fails to load, create text-only version
          createTextOnlyVersion();
        };

        const createTextOnlyVersion = () => {
          try {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px Arial, sans-serif';
            ctx.fillText('🏆 Tournament Completed!', 50, 200);
            
            ctx.font = '36px Arial, sans-serif';
            ctx.fillText(tournament.name.length > 30 ? tournament.name.substring(0, 30) + '...' : tournament.name, 50, 280);
            
            ctx.font = '28px Arial, sans-serif';
            ctx.fillStyle = '#BBF429';
            ctx.fillText(`Game: ${gameName}`, 50, 330);
            ctx.fillText(`Prize: ${prizeAmount}`, 50, 380);
            
            ctx.fillStyle = '#CCCCCC';
            ctx.font = '24px Arial, sans-serif';
            ctx.fillText('Screenshot Submitted Successfully ✅', 50, 450);
            ctx.fillText('Join tournaments at Skill Arena!', 50, 500);
            
            canvas.toBlob((blob) => {
              resolve(blob);
            }, 'image/png', 0.9);
          } catch (fallbackError) {
            console.error('Error creating fallback image:', fallbackError);
            resolve(null);
          }
        };
        
        // Set image source (this will trigger onload or onerror)
        if (userScreenshot.screenshot_path) {
          img.src = userScreenshot.screenshot_path;
        } else {
          createTextOnlyVersion();
        }
      } catch (error) {
        console.error('Error in generateSharingImage:', error);
        resolve(null);
      }
    });
  };

  const handleDownloadImage = async () => {
    setGenerating(true);
    try {
      const imageBlob = await generateSharingImage();
      if (imageBlob) {
        const url = URL.createObjectURL(imageBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tournament-result-${tournament.name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
    setGenerating(false);
  };

  const shareToSocialMedia = async (platform: string) => {
    setGenerating(true);
    try {
      const imageBlob = await generateSharingImage();
      if (imageBlob && navigator.share) {
        // Use Web Share API if available (mobile)
        const file = new File([imageBlob], `tournament-result.png`, { type: 'image/png' });
        await navigator.share({
          title: `Tournament Result: ${tournament.name}`,
          text: `I completed the ${gameName} tournament and submitted my screenshot! 🏆`,
          files: [file]
        });
      } else {
        // Fallback to platform-specific sharing
        const shareText = `I completed the ${gameName} tournament: ${tournament.name} and submitted my screenshot! 🏆 Join tournaments at Skill Arena!`;
        
        switch (platform) {
          case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400');
            break;
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank', 'width=600,height=400');
            break;
          case 'linkedin':
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
            break;
          case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
            break;
          case 'telegram':
            window.open(`https://t.me/share/url?text=${encodeURIComponent(shareText)}`, '_blank');
            break;
        }
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
    setGenerating(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="bg-black/50 border-[#BBF429]/50 text-white hover:bg-[#BBF429]/20 hover:border-[#BBF429] transition-all duration-200"
          disabled={generating}
        >
          <Share2 className="h-4 w-4 mr-2" />
          {generating ? 'Generating...' : 'Share Result'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 bg-black/90 border-[#BBF429]/30 backdrop-blur-sm p-2"
        align="end"
      >
        <div className="space-y-1">
          <button
            onClick={handleDownloadImage}
            disabled={generating}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Download Image'}
          </button>

          <div className="border-t border-[#BBF429]/30 my-2"></div>

          <button
            onClick={() => shareToSocialMedia('facebook')}
            disabled={generating}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <Facebook className="h-4 w-4 mr-2 text-blue-500" />
            Share on Facebook
          </button>

          <button
            onClick={() => shareToSocialMedia('twitter')}
            disabled={generating}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
            Share on Twitter
          </button>

          <button
            onClick={() => shareToSocialMedia('linkedin')}
            disabled={generating}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
            Share on LinkedIn
          </button>

          <div className="border-t border-[#BBF429]/30 my-2"></div>

          <button
            onClick={() => shareToSocialMedia('whatsapp')}
            disabled={generating}
            className="w-full text-left px-3 py-2 text-white hover:bg-[#BBF429]/20 rounded-md transition-colors duration-200 flex items-center"
          >
            <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
            Share on WhatsApp
          </button>

          <button
            onClick={() => shareToSocialMedia('telegram')}
            disabled={generating}
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
