import React, { useState, useEffect } from "react";
import openBook from "../assets/open.png";
import bgImage from "../assets/background.png";

function StoryView({ story }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger fade-in after mount
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!story) return null;

  const pages = story.pages || [];

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.book,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
        }}
      >
        {/* LEFT PAGE */}
        <div style={styles.page}>
          <p style={styles.leftText}>{pages[0]?.text}</p>
        </div>

        {/* RIGHT PAGE */}
        <div style={styles.page}>
          <p style={styles.rightText}>{pages[1]?.text}</p>
        </div>
      </div>
    </div >
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
    backgroundRepeat: "no-repeat", display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  book: {
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
    display: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  leftText: {
    position: "absolute",
    top: "15%",
    left: "21.5%",
    width: "80%",
    maxWidth: "375px",

    textAlign: "center",
    fontFamily: "'IM Fell English SC', serif",
    fontSize: "22px",
    color: "#3b2f2f",
  },

  rightText: {
    position: "absolute",
    bottom: "15%",
    right: "20.5%",
    width: "80%",
    maxWidth: "375px",

    textAlign: "center",
    fontFamily: "'IM Fell English SC', serif",
    fontSize: "22px",
    color: "#3b2f2f",
  },
};

export default StoryView;