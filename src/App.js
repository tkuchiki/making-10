import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const generateQuestion = (targetNumber) => {
  const a = Math.floor(Math.random() * (targetNumber - 1)) + 1;
  return [a];
};

function Question({ number, targetNumber }) {
  const [question] = useState(generateQuestion(targetNumber));

  return (
    <div className="question">
      <span>{question[0]} +</span>
    </div>
  );
}

function App() {
  const savedNum = Cookies.get('targetNumber');
  const defaultTargetNumber = 10;
  const numOfQuestions = 40;
  const [targetNumber, setTargetNumber] = useState(savedNum ? savedNum : defaultTargetNumber);
  const [showSettings, setShowSettings] = useState(false);

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
  
  const questions = Array.from({ length: numOfQuestions }).map((_, index) => <Question number={index + 1} key={index} targetNumber={targetNumber} />);

  return (
    <div className="App">
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
