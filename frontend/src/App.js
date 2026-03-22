import React, { useState } from "react";
import bgImage from "./assets/background.png";
import StoryView from "./components/StoryView";

function App() {
  const [character, setCharacter] = useState("");
  const [setting, setSetting] = useState("");
  const [storyEvent, setStoryEvent] = useState("");
  const [loading, setLoading] = useState(false);

  const [story, setStory] = useState(null);
  const [showStory, setShowStory] = useState(false);

  const isReady = character && setting && storyEvent;

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character,
          setting,
          event: storyEvent,
        }),
      });

      const data = await response.json();
      setStory(data);

      // 🔥 wait for fade-out to finish before showing story
      setTimeout(() => {
        setShowStory(true);
      }, 600);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🌫 Landing Page */}
      <div
        style={{
          ...styles.container,
          opacity: showStory ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: showStory ? "none" : "auto",
        }}
      >
        <div style={styles.overlay}>
          <h1 style={styles.title}>
            What fairy tale shall we read today?
          </h1>

          <input
            style={styles.input}
            type="text"
            placeholder="Main character (e.g. dragon)"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            onFocus={(e) => (e.target.style.border = "2px solid #a78bfa")}
            onBlur={(e) => (e.target.style.border = "2px solid #ccc")}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Setting (e.g. magical kingdom)"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            onFocus={(e) => (e.target.style.border = "2px solid #a78bfa")}
            onBlur={(e) => (e.target.style.border = "2px solid #ccc")}
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Starting event (e.g. basketball game)"
            value={storyEvent}
            onChange={(e) => setStoryEvent(e.target.value)}
            onFocus={(e) => (e.target.style.border = "2px solid #a78bfa")}
            onBlur={(e) => (e.target.style.border = "2px solid #ccc")}
          />

          <button
            style={{
              ...styles.button,
              opacity: isReady ? 1 : 0,
              transform: isReady ? "translateY(0px)" : "translateY(10px)",
              pointerEvents: isReady && !loading ? "auto" : "none",
            }}
            onClick={handleSubmit}
          >
            {loading ? "Creating story..." : "Generate Story"}
          </button>
        </div>
      </div>

      {/* 📖 Story View (separate layer) */}
      {showStory && <StoryView story={story} />}
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  input: {
    width: "400px",
    padding: "12px 16px",
    fontSize: "16px",
    marginBottom: "15px",
    borderRadius: "30px",
    border: "2px solid #ccc",
    outline: "none",
    transition: "all 0.2s ease-in-out",
  },

  button: {
    padding: "12px 24px",
    fontSize: "16px",
    marginTop: "10px",
    cursor: "pointer",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#a78bfa",
    color: "white",
    transition: "all 0.5s ease",
  },

  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },

  title: {
    fontFamily: "'IM Fell English SC', serif",
    fontSize: "42px",
    margin: "10px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#3b2f2f",
    letterSpacing: "1px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
  },
};

export default App;