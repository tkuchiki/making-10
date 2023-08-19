import React, { useState } from 'react';

const generateQuestion = () => {
  const a = Math.floor(Math.random() * 9) + 1; // 1 ~ 9
  return [a];
};

function Question({ number }) {
  const [question] = useState(generateQuestion());

  return (
    <div className="question">
      <span>{question[0]} + </span>
    </div>
  );
}

function App() {
  const numOfQuestions = 40;
  const questions = Array.from({ length: numOfQuestions }).map((_, index) => <Question number={index + 1} key={index} />);

  return (
    <div className="App">
      <div className="questions-container">
        {questions}
      </div>
    </div>
  );
}

export default App;
