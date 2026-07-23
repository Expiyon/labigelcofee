"use client";

import React, { useEffect } from 'react';

interface InstagramWindow extends Window {
  instgrm?: {
    Embeds: {
      process: () => void;
    };
  };
}

const EMBED_SCRIPT_ID = 'instagram-embed-script';

interface InstagramEmbedProps {
  /** Full post/reel URL, e.g. https://www.instagram.com/reel/XXXXXXXXXXX/ */
  url: string;
}

const InstagramEmbed = ({ url }: InstagramEmbedProps) => {
  useEffect(() => {
    const win = window as InstagramWindow;

    if (win.instgrm) {
      win.instgrm.Embeds.process();
      return;
    }

    if (document.getElementById(EMBED_SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = EMBED_SCRIPT_ID;
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => (window as InstagramWindow).instgrm?.Embeds.process();
    document.body.appendChild(script);
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: '0 auto', width: '100%', maxWidth: '540px', minWidth: '280px' }}
    />
  );
};

export default InstagramEmbed;
