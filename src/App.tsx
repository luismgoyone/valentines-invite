import { useState, useEffect } from 'react';
import './styles/App.css';
import prayerIcon from './assets/prayer.png';
import hoorayGif from './assets/hooray-letsgo.gif';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

interface Confetti {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
}

function App() {
  const [noButtonPosition, setNoButtonPosition] = useState({ top: 0, left: 0 });
  const [noButtonSize, setNoButtonSize] = useState(1);
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const [showResponse, setShowResponse] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [noClickCount, setNoClickCount] = useState(0);

  const sadMessages = [
    "No",
    "Luh oa naman!",
    "Please reconsider 💔",
    "SIGE NA PLEEEASE?",
    "But... but... 😢",
    "Pretty please? 🙏",
    "Sure ka na diyan?"
  ];

  useEffect(() => {
    // Create falling hearts
    const heartInterval = setInterval(() => {
      const newHeart: Heart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        delay: 0,
        duration: 3 + Math.random() * 2
      };
      setHearts(prev => [...prev, newHeart]);
    }, 500);

    return () => clearInterval(heartInterval);
  }, []);

  useEffect(() => {
    // Clean up old hearts
    const cleanup = setInterval(() => {
      setHearts(prev => prev.slice(-20));
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  const handleNoClick = () => {
    setNoClickCount(prev => prev + 1);
    
    // Make "No" button smaller and move it
    setNoButtonSize(prev => Math.max(0.3, prev - 0.15));
    
    // Make "Yes" button bigger
    setYesButtonSize(prev => prev + 0.3);
    
    // Move "No" button to random position
    const maxWidth = window.innerWidth - 100;
    const maxHeight = window.innerHeight - 100;
    setNoButtonPosition({
      top: Math.random() * maxHeight,
      left: Math.random() * maxWidth
    });
  };

  const handleYesClick = () => {
    setShowResponse(true);
    
    // Create confetti
    const newConfetti: Confetti[] = [];
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#ff5e78', '#ff8a5c'];
    
    for (let i = 0; i < 100; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2
      });
    }
    setConfetti(newConfetti);
  };

  if (showResponse) {
    return (
      <div className="container success">
        {confetti.map(c => (
          <div
            key={c.id}
            className="confetti"
            style={{
              left: `${c.left}%`,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`
            }}
          />
        ))}
        <div className="content">
          <h1 className="success-title">HOOORAH! 🎉</h1>
          <div className="big-heart">
            <img src={hoorayGif} alt="Hooray Let's Go" className="hooray-gif" />
          </div>
          <p className="success-message">
            You won't regret it baby 😉
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="falling-heart"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`
          }}
        >
          ❤️
        </div>
      ))}
      
      <div className="content">
        <h1 className="title">Will you be my valentine? 💝</h1>
        <div className="heart-icon">
          <img src={prayerIcon} alt="Prayer" className="prayer-icon" />
        </div>
        <p className="message">
          Don't be scared, just press yes
        </p>
        
        <div className="buttons-container">
          <button
            className="yes-button"
            onClick={handleYesClick}
            style={{
              transform: `scale(${yesButtonSize})`
            }}
          >
            Yes
          </button>
          
          <button
            className="no-button"
            onClick={handleNoClick}
            style={{
              transform: `scale(${noButtonSize})`,
              ...(noClickCount > 0 ? {
                position: 'fixed',
                top: `${noButtonPosition.top}px`,
                left: `${noButtonPosition.left}px`
              } : {})
            }}
          >
            {noClickCount < sadMessages.length ? sadMessages[noClickCount] : "No"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
