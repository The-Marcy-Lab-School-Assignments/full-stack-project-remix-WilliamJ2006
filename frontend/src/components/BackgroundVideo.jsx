import { useState } from 'react';

function BackgroundVideo() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="backgroundVideo"
      >
        <source src="/videos/menu-loop.mp4" type="video/mp4" />
      </video>

      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={() => setIntroFinished(true)}
        className={`backgroundVideo introVideo ${
          introFinished ? 'fadeOut' : ''
        }`}
      >
        <source src="/videos/menu-intro.mp4" type="video/mp4" />
      </video>
    </>
  );
}

export default BackgroundVideo;
