import React, { useState, useEffect } from "react";
import bgImage from "../assets/background.png";
import openBook from "../assets/open.png";
import turn1 from "../assets/corner_turn.png";
import turn2 from "../assets/page_turn.png";

function StoryView({ story }) {
  const [visible, setVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [turnFrame, setTurnFrame] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!story) return null;

  const pages = story.pages || [];

  // ✅ MOVE FUNCTION INSIDE COMPONENT
  const handleNextPage = () => {
    if (phase !== "idle") return;

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
          }, 500);

        }, 500);
      }, 500);

    }, 500);
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
        {/* ✅ TURNING ANIMATION */}
        {phase === "turning" ? (
          <img
            src={turnFrame === 0 ? turn1 : turn2}
            style={styles.turnImage}
            alt="page turn"
          />
        ) : (
          <>
            {/* LEFT PAGE */}
            <div style={styles.page}>
              <p
                style={{
                  ...styles.leftText,
                  opacity: phase === "fadingOut" ? 0 : 1,
                  transition: "opacity 0.5s ease",
                }}
              >
                {pages[currentPage]?.text}
              </p>
            </div>

            {/* RIGHT PAGE */}
            <div style={styles.page}>
              <p
                style={{
                  ...styles.rightText,
                  opacity: phase === "fadingOut" ? 0 : 1,
                  transition: "opacity 0.5s ease",
                }}
              >
                {pages[currentPage + 1]?.text}
              </p>
            </div>
          </>
        )}
      </div>

      {/* ✅ NEXT BUTTON */}
      <button style={styles.nextButton} onClick={handleNextPage}>
        Next →
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
    position: "relative", // ✅ IMPORTANT
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
    position: "relative", // ✅ FIXED
  },

  leftText: {
    position: "absolute",
    top: "10%",
    left: "40%",
    width: "70%",
    maxWidth: "500px",

    textAlign: "center",
    fontFamily: "'IM Fell English SC', serif",
    fontSize: "clamp(16px, 1.5vw, 24px)",
    color: "#3b2f2f",
    lineHeight: "1.5",
  },

  rightText: {
    position: "absolute",
    bottom: "10%",
    right: "37.5%",
    width: "70%",
    maxWidth: "500px",

    textAlign: "center",
    fontFamily: "'IM Fell English SC', serif",
    fontSize: "clamp(16px, 1.5vw, 24px)",
    color: "#3b2f2f",
    lineHeight: "1.5",
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
};

export default StoryView;