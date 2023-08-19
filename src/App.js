import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const generateQuestion = (targetNumber) => {
  const a = Math.floor(Math.random() * (targetNumber - 1)) + 1;
  return [a];
};

function Question({ number, targetNumber }) {
  const [question] = useState(generateQuestion(targetNumber));
  const canvasRef = useRef(null);

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    canvas.addEventListener('pointermove', handleDrawing);
    canvas.addEventListener('pointerup', stopDrawing);
  };

  const handleDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    const canvas = canvasRef.current;
    canvas.removeEventListener('pointermove', handleDrawing);
    canvas.removeEventListener('pointerup', stopDrawing);
  };

  return (
    <div className="question">
      <span><span className="number">{question[0]}</span> +
      <canvas
        ref={canvasRef}
        width={60}
        height={60}
        onPointerDown={handlePointerDown}
        className="answer-canvas"
      />
     </span>
    </div>
  );
}


function App() {
  const savedNum = Cookies.get('targetNumber');
  const defaultTargetNumber = 10;
  const numOfQuestions = 50;
  const [targetNumber, setTargetNumber] = useState(savedNum ? savedNum : defaultTargetNumber);
  const [showSettings, setShowSettings] = useState(false);
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  
  useEffect(() => {
    const savedTargetNumber = Cookies.get('targetNumber');
    if (savedTargetNumber) {
      setTargetNumber(Number(savedTargetNumber));
    }
  }, []);

  useEffect(() => {
    if (isScrollDisabled) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isScrollDisabled]);

  const handleSaveSettings = () => {
    Cookies.set('targetNumber', targetNumber, { expires: 365 });
    setShowSettings(false);
  };
  
  const questions = Array.from({ length: numOfQuestions }).map((_, index) => <Question number={index + 1} key={index} targetNumber={targetNumber} />);

  return (
    <div className="App">
      <button onClick={() => setIsScrollDisabled(!isScrollDisabled)}>
        {isScrollDisabled ? 'Enable scroll' : 'Disable scroll'}
      </button>
      {showSettings ? (
        <div className="settings">
          <label>
            Number:
            <input
              type="number"
              value={targetNumber}
              onChange={e => setTargetNumber(Number(e.target.value))}
            />
          </label>
          <button onClick={handleSaveSettings}>Save</button>
        </div>
      ) : (
        <>
          <button onClick={() => setShowSettings(true)}>Setting</button>
          <h2>{targetNumber}の合成 / Making {targetNumber}</h2>
          <div className="questions-container">{questions}</div>
        </>
      )}
    </div>
  );
}

export default App;
