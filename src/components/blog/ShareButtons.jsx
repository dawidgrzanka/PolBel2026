import React from 'react';
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ShareButtons({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    toast.success('Link skopiowany do schowka!');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-2">Udostępnij:</span>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#1877f2] hover:bg-[#1877f2]/90 flex items-center justify-center text-white transition-colors"
        aria-label="Udostępnij na Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center text-white transition-colors"
        aria-label="Udostępnij na X (Twitter)"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#0a66c2] hover:bg-[#0a66c2]/90 flex items-center justify-center text-white transition-colors"
        aria-label="Udostępnij na LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <Button
        variant="outline"
        size="icon"
        className="w-9 h-9 rounded-full"
        onClick={copyToClipboard}
        aria-label="Kopiuj link"
      >
        <Link2 className="w-4 h-4" />
      </Button>
    </div>
  );
}