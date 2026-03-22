import React, { useState, useEffect } from "react";
import bgImage from "../assets/background.png";
import openBook from "../assets/open.png";
import frontCover from "../assets/cover.png";
import backCover from "../assets/back_cover.png";
import turn1 from "../assets/corner_turn.png";
import turn2 from "../assets/page_turn.png";
import leftTurn1 from "../assets/left_corner_turn.png";
import leftTurn2 from "../assets/left_page_turn.png";

function StoryView({ story }) {
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [turnFrame, setTurnFrame] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [viewMode, setViewMode] = useState("frontCover");

  // ✨ staggered fade states
  const [leftTextVisible, setLeftTextVisible] = useState(true);
  const [leftImageVisible, setLeftImageVisible] = useState(true);
  const [rightTextVisible, setRightTextVisible] = useState(true);
  const [rightImageVisible, setRightImageVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ✨ staggered fade logic
  useEffect(() => {
    if (phase === "fadingOut") {
      setLeftTextVisible(false);
      setLeftImageVisible(false);
      setRightTextVisible(false);
      setRightImageVisible(false);
    }

    if (phase === "fadingIn") {
      setTimeout(() => setLeftTextVisible(true), 200);
      setTimeout(() => setLeftImageVisible(true), 900);
      setTimeout(() => setRightTextVisible(true), 1600);
      setTimeout(() => setRightImageVisible(true), 2300);
    }
  }, [phase]);

  if (!story) return null;

  const rawPages = story.pages || [];

  const pages = rawPages.length % 2 === 0
    ? rawPages
    : [...rawPages, { text: "" }];

  const getImageForPage = (index) => {
    return `http://127.0.0.1:5000/images/page_${index + 1}.png`;
  };

  const triggerPageTurn = (newPage) => {
    setPhase("fadingOut");

    setTimeout(() => {
      setPhase("turning");
      setTurnFrame(0);

      setTimeout(() => {
        setTurnFrame(1);

        setTimeout(() => {
          newPage();
          setPhase("fadingIn");

          setTimeout(() => {
            setPhase("idle");
          }, 2500);
        }, 200);
      }, 200);
    }, 200);
  };

  const handleNextPage = () => {
    if (phase !== "idle") return;

    if (viewMode === "frontCover") {
      triggerPageTurn(() => {
        setViewMode("pages");
        setCurrentPage(0);
      });
      return;
    }

    if (currentPage + 2 >= pages.length) {
      triggerPageTurn(() => setViewMode("backCover"));
      return;
    }

    setDirection("forward");
    triggerPageTurn(() => setCurrentPage((prev) => prev + 2));
  };

  const handlePrevPage = () => {
    if (phase !== "idle") return;

    if (viewMode === "backCover") {
      triggerPageTurn(() => {
        setViewMode("pages");
        setCurrentPage(pages.length - 2);
      });
      return;
    }

    if (viewMode === "pages" && currentPage === 0) {
      triggerPageTurn(() => setViewMode("frontCover"));
      return;
    }

    setDirection("backward");
    triggerPageTurn(() => setCurrentPage((prev) => Math.max(prev - 2, 0)));
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.book,
          backgroundImage: viewMode === "pages" ? `url(${openBook})` : "none",
          padding: viewMode === "pages" ? "60px" : "0px",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          width: viewMode === "pages" ? "90vw" : "100vw",
          height: viewMode === "pages" ? "auto" : "100vh",
        }}
      >
        {phase === "turning" ? (
          <img
            src={
              direction === "forward"
                ? (turnFrame === 0 ? turn1 : turn2)
                : (turnFrame === 0 ? leftTurn1 : leftTurn2)
            }
            style={styles.turnImage}
            alt="page turn"
          />
        ) : viewMode === "frontCover" ? (
          <div style={styles.cover}>
            <img src={frontCover} style={styles.fullCoverImage} alt="front cover" />
            <h1 style={styles.coverTitle}>{story.title}</h1>
          </div>
        ) : viewMode === "backCover" ? (
          <div style={styles.cover}>
            <img src={backCover} style={styles.fullCoverImage} alt="back cover" />
            <h1 style={styles.coverTitle}>The End</h1>
          </div>
        ) : (
          <>
            <div style={styles.page}>
              <div style={styles.leftImageContainer}>
                <img
                  src={getImageForPage(currentPage)}
                  style={{
                    ...styles.pageImage,
                    opacity: leftImageVisible ? 1 : 0,
                    transition: "opacity 1.5s ease",
                  }}
                  alt="page illustration"
                />
              </div>

              <div style={styles.leftTextContainer}>
                <p
                  style={{
                    ...styles.text,
                    opacity: leftTextVisible ? 1 : 0,
                    transition: "opacity 2s ease",
                  }}
                >
                  {pages[currentPage]?.text}
                </p>
              </div>
            </div>

            <div style={styles.page}>
              <div style={styles.rightImageContainer}>
                <img
                  src={getImageForPage(currentPage + 1)}
                  style={{
                    ...styles.pageImage,
                    opacity: rightImageVisible ? 1 : 0,
                    transition: "opacity 1.5s ease",
                  }}
                  alt="page illustration"
                />
              </div>

              <div style={styles.rightTextContainer}>
                <p
                  style={{
                    ...styles.text,
                    opacity: rightTextVisible ? 1 : 0,
                    transition: "opacity 2s ease",
                  }}
                >
                  {pages[currentPage + 1]?.text}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <button style={styles.nextButton} onClick={handleNextPage}>
        Next →
      </button>

      <button
        style={{
          ...styles.backButton,
          opacity: viewMode === "frontCover" ? 0.5 : 1,
          pointerEvents: viewMode === "frontCover" ? "none" : "auto",
        }}
        onClick={handlePrevPage}
      >
        ← Back
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  book: {
    position: "relative",
    aspectRatio: "16 / 10",
    maxWidth: "1200px",
    width: "90vw",
    height: "auto",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "space-between",
    transition: "all 0.8s ease",
  },

  page: {
    width: "45%",
    position: "relative",
  },

  leftImageContainer: {
    position: "absolute",
    top: "50%",
    left: "75%",
    transform: "translate(-50%, -50%)",
  },

  rightImageContainer: {
    position: "absolute",
    top: "50%",
    left: "25%",
    transform: "translate(-50%, -50%)",
  },

  leftTextContainer: {
    position: "absolute",
    top: "10%",
    left: "75%",
    transform: "translateX(-50%)",
    width: "70%",
  },

  rightTextContainer: {
    position: "absolute",
    bottom: "10%",
    left: "25%",
    transform: "translateX(-50%)",
    width: "70%",
  },

  text: {
    textAlign: "center",
    fontFamily: "'IM Fell English SC', serif",
    fontSize: "clamp(16px, 1.5vw, 24px)",
    color: "#3b2f2f",
    lineHeight: "1.5",
  },

  pageImage: {
    width: "25vw",
    objectFit: "contain",
    pointerEvents: "none",
    WebkitMaskImage: "radial-gradient(circle, black 70%, transparent 100%)",
    maskImage: "radial-gradient(circle, black 70%, transparent 100%)",
    filter: "blur(0.2px)",
  },

  turnImage: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
    position: "absolute",
    top: 0,
    left: 0,
  },

  cover: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  fullCoverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    zIndex: 1,
  },

  coverTitle: {
    position: "relative",
    zIndex: 2,
    fontFamily: "'IM Fell English SC', serif",
    fontSize: "clamp(36px, 5vw, 36px)",
    maxWidth: "40%",
    color: "#d4af37",
    textShadow: "0 2px 6px rgba(0,0,0,0.6)",
  },

  nextButton: {
    position: "absolute",
    bottom: "40px",
    right: "40px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#9a7ef0",
    color: "white",
    cursor: "pointer",
  },

  backButton: {
    position: "absolute",
    bottom: "40px",
    left: "40px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#a78bfa",
    color: "white",
    cursor: "pointer",
  },
};

export default StoryView;