import { useState } from 'react';

function BackgroundVideo({ intro, loop }) {
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
        <source src={loop} type="video/mp4" />
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
        <source src={intro} type="video/mp4" />
      </video>
    </>
  );
}

export default BackgroundVideo;
