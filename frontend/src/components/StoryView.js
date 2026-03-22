import React, { useState, useEffect } from "react";
import bgImage from "../assets/background.png";
import openBook from "../assets/open.png";
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

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!story) return null;

  const pages = story.pages || [];

  const getImageForPage = (index) => {
    return `http://127.0.0.1:5000/images/page_${index + 1}.png`;
  };

  // 👉 NEXT (right → left)
  const handleNextPage = () => {
    if (phase !== "idle") return;

    setDirection("forward");
    setPhase("fadingOut");

    setTimeout(() => {
      setPhase("turning");
      setTurnFrame(0);

      setTimeout(() => {
        setTurnFrame(1);

        setTimeout(() => {
          setCurrentPage((prev) => prev + 2);
          setPhase("fadingIn");

          setTimeout(() => {
            setPhase("idle");
          }, 600);
        }, 700);
      }, 600);
    }, 600);
  };

  // 👉 BACK (left → right)
  const handlePrevPage = () => {
    if (phase !== "idle" || currentPage === 0) return;

    setDirection("backward");
    setPhase("fadingOut");

    setTimeout(() => {
      setPhase("turning");
      setTurnFrame(0);

      setTimeout(() => {
        setTurnFrame(1);

        setTimeout(() => {
          setCurrentPage((prev) => Math.max(prev - 2, 0));
          setPhase("fadingIn");

          setTimeout(() => {
            setPhase("idle");
          }, 600);
        }, 700);
      }, 600);
    }, 600);
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.book,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
        }}
      >
        {/* PAGE TURN */}
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
        ) : (
          <>
            {/* LEFT PAGE */}
            <div style={styles.page}>
              {/* IMAGE */}
              <div style={styles.leftImageContainer}>
                <img
                  src={getImageForPage(currentPage)}
                  style={styles.pageImage}
                  alt="page illustration"
                />
              </div>

              {/* TEXT */}
              <div style={styles.leftTextContainer}>
                <p
                  style={{
                    ...styles.text,
                    opacity: phase === "fadingOut" ? 0 : 1,
                  }}
                >
                  {pages[currentPage]?.text}
                </p>
              </div>
            </div>

            {/* RIGHT PAGE */}
            <div style={styles.page}>
              {/* IMAGE */}
              <div style={styles.rightImageContainer}>
                <img
                  src={getImageForPage(currentPage + 1)}
                  style={styles.pageImage}
                  alt="page illustration"
                />
              </div>

              {/* TEXT */}
              <div style={styles.rightTextContainer}>
                <p
                  style={{
                    ...styles.text,
                    opacity: phase === "fadingOut" ? 0 : 1,
                  }}
                >
                  {pages[currentPage + 1]?.text}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CONTROLS */}
      <button style={styles.nextButton} onClick={handleNextPage}>
        Next →
      </button>

      <button
        style={{
          ...styles.backButton,
          opacity: currentPage === 0 ? 0.5 : 1,
          pointerEvents: currentPage === 0 ? "none" : "auto",
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
    height: "100vh",
    aspectRatio: "16 / 10",
    backgroundImage: `url(${openBook})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "space-between",
    padding: "60px",
    transition: "all 0.8s ease",
  },

  page: {
    width: "45%",
    position: "relative",
  },

  leftImageContainer: {
    position: "absolute",
    top: "45%",
    left: "75%", // tweak this
    transform: "translate(-50%, -50%)",
  },

  rightImageContainer: {
    position: "absolute",
    top: "45%",
    left: "25%", // tweak this
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
    transition: "opacity 0.5s ease",
  },

  pageImage: {
    width: "18vw",
    maxWidth: "280px",
    minWidth: "180px",

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
    animation: "fadeIn 0.4s ease forwards",
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