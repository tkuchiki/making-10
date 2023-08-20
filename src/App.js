import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const generateQuestion = (targetNumber) => {
  const a = Math.floor(Math.random() * (targetNumber - 1)) + 1;
  return [a];
};

const generateQuestions = (targetNumber, numOfQuestions) => {
    let questionArray = [];
    for (let i = 0; i < numOfQuestions; i++) {
      questionArray.push(generateQuestion(targetNumber));
    }
  
    return questionArray;
};

function Questions({ number, targetNumber, numOfQuestions }) {
  const [questions, setQuestions] = useState(generateQuestions(targetNumber, numOfQuestions));

  useEffect(() => {
    setQuestions(generateQuestions(targetNumber, numOfQuestions));
  }, [targetNumber, numOfQuestions]);

  return (
    <div className="questions">
      {questions.map((q, index) => (
        <Question key={index} number={index + 1} questionData={q} />
      ))}
    </div>
  );
}

function Question({questionData}) {
  return (
    <div className="question">
      <span className="number">{questionData[0]}</span> +
      <Canvas />
    </div>
  );
}

function Canvas() {
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
    <canvas ref={canvasRef} width={60} height={60} onPointerDown={handlePointerDown} className="answer-canvas"></canvas>
  );
}

function App() {
  const savedNum = Cookies.get('targetNumber');
  const defaultTargetNumber = 10;
  const numOfQuestions = 50;
  const defaultFontSize = 25;
  const [targetNumber, setTargetNumber] = useState(savedNum ? savedNum : defaultTargetNumber);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [isScrollingDisabled, setIsScrollingDisabled] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const savedTargetNumber = Cookies.get('targetNumber');
    if (savedTargetNumber) {
      setTargetNumber(Number(savedTargetNumber));
    }
  }, []);

  const handleSaveSettings = () => {
    Cookies.set('targetNumber', targetNumber, { expires: 365 });
    setShowSettings(false);
  };

  const handleToggleScroll = () => {
    setIsScrollingDisabled(prevState => {
      if (prevState) {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }
      return !prevState;
    });
  };

  const zoomIn = () => {
    setScale(prevScale => prevScale + 0.1);
  };

  const zoomOut = () => {
    setScale(prevScale => prevScale - 0.1);
  };

  const regenerateQuestions = () => {
    setRefreshKey(Date.now());
  };
  
  return (
      <div className="App">
        <div className="fixed-controls">
          <button onClick={handleToggleScroll}>
            {isScrollingDisabled ? "Enable scroll" : "Disable scroll"}
          </button>
          <button onClick={zoomIn}> + </button>
          <button onClick={zoomOut}> - </button>
          <button onClick={regenerateQuestions}>recreate</button>
          <button onClick={() => setShowSettings(true)}>Setting</button>
        </div>
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
          <div style={{ transform: `scale(${scale})` }}>
          <h2>{targetNumber}の合成 / Making {targetNumber}</h2>
          <div className="questions-container">
            <Questions key={refreshKey} targetNumber={targetNumber} numOfQuestions={numOfQuestions} />
          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
