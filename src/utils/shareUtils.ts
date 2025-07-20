// Share utility functions
export const shareToSocialMedia = {
  facebook: (url: string) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  },

  twitter: (url: string, text: string) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  },

  linkedin: (url: string) => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  },

  whatsapp: (url: string, text: string) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  },

  telegram: (url: string, text: string) => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  },

  copyToClipboard: async (url: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      console.error('Failed to copy link:', err);
      return false;
    }
  },

  // Check if Web Share API is available (for mobile devices)
  nativeShare: async (data: { title: string; text: string; url: string }): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        console.error('Native sharing failed:', err);
        return false;
      }
    }
    return false;
  }
};

export const generateShareText = {
  tournament: (tournamentName: string, gameName?: string) => 
    `Check out this amazing ${gameName || 'Tournament'}: ${tournamentName}! Join now and compete for prizes! 🏆`,
  
  tournamentResult: (tournamentName: string, gameName?: string) => 
    `Check out the results of this ${gameName || 'Tournament'}: ${tournamentName}! 🏆`,
  
  leaderboard: () => 
    `Check out the current leaderboard rankings! See where you stand among the best players! 🏆`,
  
  profile: (username: string) => 
    `Check out ${username}'s gaming profile and achievements! 🎮`,
};
