import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Heart,
  Music2,
  Pause,
  Play,
  Sparkles,
  Stars,
} from "lucide-react";

const petals = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 7) % 100}%`,
  delay: (i % 7) * -1.8,
  duration: 11 + (i % 6) * 2,
  size: 8 + (i % 4) * 3,
}));

const soloPhotos = [
  { src: "/1.jpeg", caption: "That beautiful smile ♡" },
  { src: "/12.jpeg", caption: "Simply wonderful" },
  { src: "/3.jpeg", caption: "Lost in her world" },
  { src: "/4.jpeg", caption: "My favourite view" },
  { src: "/5.jpeg", caption: "A little sunshine" },
  { src: "/6.jpeg", caption: "Pretty in every moment" },
  { src: "/7.jpeg", caption: "The cutest soul ♡" },
  { src: "/8.jpeg", caption: "Always, beautifully you" },
];

const couplePhotos = [
  {
    src: "/2.jpeg",
    caption: "You and me ♡",
    date: "A favourite memory",
  },
  {
    src: "/9.jpeg",
    caption: "Our little world",
    date: "Just us",
  },
  {
    src: "/10.jpeg",
    caption: "Collecting moments",
    date: "One for the memories",
  },
  {
    src: "/11.jpeg",
    caption: "My favourite company",
    date: "And many more to come",
  },
];

function Photo({ src, caption }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="photo-image-wrap">
      {!failed ? (
        <img
          src={src}
          alt={caption}
          loading="lazy"
          className="photo-image"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="photo-placeholder">
          <Heart size={25} />
          <span>Photo not found</span>
          <small>{src}</small>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false
  );

  const touchStartX = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const updatePhoneLayout = (event) => {
      setIsPhone(event.matches);
    };

    setIsPhone(mediaQuery.matches);
    mediaQuery.addEventListener("change", updatePhoneLayout);

    return () => {
      mediaQuery.removeEventListener("change", updatePhoneLayout);
    };
  }, []);

  // Smaller horizontal movement on phones prevents clipping.
  const sideOffset = isPhone ? 62 : 105;

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch (error) {
      console.error("Unable to play background music:", error);
      setMusicPlaying(false);
    }
  }

  async function openSurprise() {
    setOpened(true);

    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch {
      // If autoplay is blocked, the music button can start playback.
      setMusicPlaying(false);
    }
  }

  function changePhoto(direction) {
    setActivePhoto(
      (current) =>
        (current + direction + couplePhotos.length) %
        couplePhotos.length
    );
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const distance =
      event.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(distance) > 45) {
      changePhoto(distance < 0 ? 1 : -1);
    }

    touchStartX.current = null;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#160f19] text-[#fff4f1]">
      <audio
        ref={audioRef}
        src="/music/birthday-song.mp3"
        loop
        preload="metadata"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />

      <div className="grain" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="petal-field" aria-hidden="true">
        {petals.map((petal) => (
          <span
            className="petal"
            key={petal.id}
            style={{
              left: petal.left,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`,
              width: petal.size,
              height: petal.size * 1.5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="site-header relative z-20 flex items-center justify-between px-6 py-6 sm:px-10">
        <a className="brand" href="#home" aria-label="Home">
          <Heart size={17} fill="currentColor" strokeWidth={1.4} />
          <span>a little surprise</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#home">Home</a>
          <a href="#her-moments">Her moments</a>
          <a href="#our-story">Our story</a>
          <a href="#note">A little note</a>
        </nav>

        <button
          className={`music-control ${
            musicPlaying ? "is-playing" : ""
          }`}
          onClick={toggleMusic}
          aria-label={
            musicPlaying
              ? "Pause background music"
              : "Play background music"
          }
        >
          {musicPlaying ? <Pause size={16} /> : <Play size={16} />}
          <Music2 size={15} />
          <span>
            {musicPlaying ? "Playing our song" : "Play our song"}
          </span>
        </button>
      </header>

      {/* Birthday reveal */}
      <section
        id="home"
        className="hero relative z-10 flex min-h-[82vh] flex-col items-center justify-center px-5 pb-20 pt-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="orb mb-8 flex items-center justify-center"
        >
          <span className="orb-ring" />
          <Heart
            size={31}
            strokeWidth={1.2}
            fill="#f6a9b9"
            color="#f6a9b9"
          />
          <span className="orb-sparkle">
            <Sparkles size={16} />
          </span>
        </motion.div>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          FOR MY FAVOURITE PERSON
        </motion.p>

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -18,
                filter: "blur(8px)",
              }}
              transition={{ duration: 0.65 }}
            >
              <h1 className="hero-title">
                A little magic,
                <br />
                <em>just for you.</em>
              </h1>

              <p className="hero-copy">
                I made a tiny corner of the internet to celebrate
                <br className="hidden sm:block" />
                the wonderful person you are.
              </p>

              <motion.button
                className="surprise-button"
                onClick={openSurprise}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Open your surprise
                <Heart size={16} fill="currentColor" />
              </motion.button>

              <p className="tiny-hint">
                P.S. this is only the beginning ♡
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="reveal-copy"
            >
              <p className="eyebrow">TODAY IS ALL ABOUT YOU</p>

              <h1 className="hero-title">
                Happy Birthday,
                <br />
                <em>beautiful soul.</em>
              </h1>

              <p className="hero-copy">
                I hope this new chapter brings you gentle mornings,
                <br className="hidden sm:block" />
                big reasons to smile, and all the love you deserve.
              </p>

              <div className="heart-row" aria-label="Lots of love">
                {[0, 1, 2, 3, 4].map((n) => (
                  <motion.span
                    key={n}
                    initial={{ opacity: 0, y: 12, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: n * 0.12,
                      type: "spring",
                    }}
                  >
                    <Heart
                      size={17}
                      fill="#f6a9b9"
                      color="#f6a9b9"
                    />
                  </motion.span>
                ))}
              </div>

              <button
                className="text-button"
                onClick={() =>
                  document
                    .getElementById("her-moments")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See what I made for you
                <ArrowDown size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="scroll-cue"
          animate={{ y: [0, 7, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </section>

      {/* Her eight photos */}
      <section
        id="her-moments"
        className="solo-section relative z-10"
      >
        <div className="solo-heading">
          <p className="eyebrow">
            THE GIRL WHO MAKES MY WORLD BRIGHTER
          </p>

          <h2 className="section-title">
            Her little <em>universe.</em>
          </h2>

          <p className="section-subtitle">
            Eight little glimpses of someone endlessly special to me.
          </p>
        </div>

        <div className="memory-wall">
          <div className="wall-vine vine-left" aria-hidden="true">
            ❀ ✿ ❀
          </div>

          <div className="wall-vine vine-right" aria-hidden="true">
            ✿ ❀ ✿
          </div>

          <div className="fairy-lights" aria-hidden="true">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} style={{ "--i": i }} />
            ))}
          </div>

          <div className="solo-grid">
            {soloPhotos.map((photo, index) => (
              <motion.figure
                key={photo.src}
                className={`solo-frame solo-frame-${index + 1}`}
                initial={{
                  opacity: 0,
                  y: 28,
                  rotate: index % 2 ? 3 : -3,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: index % 2 ? 2 : -2,
                }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: (index % 4) * 0.08,
                }}
                whileHover={{
                  y: -7,
                  rotate: 0,
                  scale: 1.035,
                }}
              >
                <span className="frame-pin" aria-hidden="true" />
                <Photo src={photo.src} caption={photo.caption} />
                <figcaption>{photo.caption}</figcaption>
                <Heart className="frame-heart" size={12} />
              </motion.figure>
            ))}
          </div>

          <p className="wall-message">
            In every little moment, there is something beautiful about you. ♡
          </p>
        </div>
      </section>

      {/* Four-photo Polaroid carousel */}
      
      {/* OUR STORY — A ROMANTIC MEMORY JOURNAL */}
      <section id="our-story" className="story-section relative z-10">
        <div className="story-container">
          <motion.div
            className="story-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="story-kicker">
              <span className="story-kicker-line" />
              THE TWO OF US
              <span className="story-kicker-line" />
            </span>

            <h2 className="story-title">
              Little moments,
              <br />
              <em>big feelings.</em>
            </h2>

            <p className="story-description">
              Some memories become special without even trying.
              Maybe it's the smile, the place, or simply who
              you're standing beside. These are a few of mine.
            </p>

            <div className="story-heart-divider" aria-hidden="true">
              <span />
              <Heart size={15} />
              <span />
            </div>
          </motion.div>

          <div className="story-timeline">
            {couplePhotos.map((photo, index) => (
              <motion.article
                key={photo.src}
                className={`story-memory story-memory-${index + 1}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                }}
              >
                <div className="story-memory-marker">
                  <span>0{index + 1}</span>
                </div>

                <div className="story-memory-card">
                  <div className="story-photo-frame">
                    <Photo
                      src={photo.src}
                      caption={photo.caption}
                    />
                    <span className="story-photo-index">
                      MEMORY NO. 0{index + 1}
                    </span>
                  </div>

                  <div className="story-memory-copy">
                    <span className="story-memory-label">
                      A LITTLE PIECE OF US
                    </span>

                    <h3>{photo.caption}</h3>

                    <p className="story-memory-text">
                      {[
                        "A moment worth keeping, long after the day is over.",
                        "The simplest memories can mean the most.",
                        "A little snapshot of a feeling I want to remember.",
                        "One more memory to keep close to my heart.",
                      ][index]}
                    </p>

                    <span className="story-memory-date">
                      <Heart size={12} fill="currentColor" />
                      {photo.date}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="story-ending"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="story-ending-sparkle">✳</span>

            <p className="story-ending-eyebrow">
              AND THIS IS ONLY A LITTLE PART OF IT
            </p>

            <h3>
              My favourite memories
              <br />
              <em>are still waiting to happen.</em>
            </h3>

            <p className="story-ending-note">
              Here's to more laughter, more little adventures,
              and more moments that turn into favourite memories. ♡
            </p>

            <div className="story-ending-hearts" aria-hidden="true">
              ♡ &nbsp; ♡ &nbsp; ♡
            </div>
          </motion.div>
        </div>
      </section>


      {/* Birthday note */}
      <section
        id="note"
        className="note-section relative z-10 px-5 py-20 sm:py-28"
      >
        <motion.div
          className="note-card mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <Stars className="note-star" size={22} />

          <p className="eyebrow">A SMALL NOTE FOR YOU</p>

          <h2 className="section-title">
            You make life <em>softer.</em>
          </h2>

          <p className="note-copy">
            Some people make ordinary days feel a little more special
            just by being themselves. You are that kind of person.
            Today, I hope you feel celebrated, appreciated, and loved
            in a hundred little ways.
          </p>

          <p className="signature">
            With all my heart <span>♡</span>
          </p>
        </motion.div>
      </section>

      <footer className="relative z-10 px-6 py-8 text-center">
        <Heart
          className="mx-auto mb-3"
          size={16}
          fill="#f6a9b9"
          color="#f6a9b9"
        />

        <p className="footer-line">
          A little website. A lot of love.
        </p>
      </footer>
    </main>
  );
}