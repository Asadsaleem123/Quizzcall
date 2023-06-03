import React from "react";
import { decodeEntity, decode } from 'html-entities';
import Confetti from "react-confetti";
export default function QUESTIONSPage() {
  const [questions, setQuestions] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [allOptionsSelected, setAllOptionsSelected] = React.useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(null);
  const [showButton,setShowButton] = React.useState(false)
  const [submitted,setSubmitted] = React.useState(false)

  React.useEffect(()=>{
    setTimeout(()=>{
       setShowButton(true)
    },3000)
  },[])
  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }
  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=21&difficulty=medium&type=multiple")
      .then(res => res.json())
      .then(data => {
        const formattedQuestions = data.results.map(question => {
          const incorrectAnswers = shuffleArray(question.incorrect_answers);
          const correctAnswer = question.correct_answer;
          const shuffledAnswers = [...incorrectAnswers, correctAnswer];
          return { ...question, answers: shuffleArray(shuffledAnswers), selectedOption: "" };
        });
        setQuestions(formattedQuestions);
      });
  }, []);
  React.useEffect(() => {
    const areAllOptionsSelected = questions.every(que => que.selectedOption !== "");
    setAllOptionsSelected(areAllOptionsSelected);
  }, [questions]);

  function handleRadioChange(questionIndex, optionValue) {
    const updatedArray = [...questions];
    const previousSelectedOption = updatedArray[questionIndex.groupIndex].selectedOption;
    updatedArray[questionIndex.groupIndex].selectedOption = optionValue;
    setQuestions(updatedArray);
    setSelectedOptionIndex(questionIndex.groupIndex);
  }

  function checkAnswer() {
    if (allOptionsSelected) {
      setShowAnswer(true);
      setSubmitted(true)
      const correctAnswers = questions.filter(que => que.correct_answer === que.selectedOption);
      setScore(correctAnswers.length);
    }
  }

  function refreshPage() {
    window.location.reload();
  }

  return (
  
    <div className="container">
          {showAnswer && <Confetti/>}
      {questions.map((que, groupIndex) => (
        <div key={groupIndex}>
          <h5>{decodeEntity(decode(que.question))}</h5>
          <div className="options">
            {que.incorrect_answers.map((answer, index) => {
              const id = `radio${index}-${groupIndex}`;
              return (
                <div key={index}>
                  <input
                    type="radio"
                    value={answer}
                    name={`radios-${groupIndex}`}
                    id={id}
                    onChange={() => handleRadioChange({ groupIndex, answerIndex: index }, answer)}
                  />
                  <label htmlFor={id}>
                    {decodeEntity(decode(answer))}
                  </label>
                </div>
              );
            })}
            <input
              type="radio"
              value={que.correct_answer}
              name={`radios-${groupIndex}`}
              id={`correct-${groupIndex}`}
              onChange={() => handleRadioChange({ groupIndex, answerIndex: "correct" }, que.correct_answer)}
            />
            <label
              htmlFor={`correct-${groupIndex}`}
              style={{backgroundColor: submitted?"green":""}}
            >
              {decodeEntity(decode(que.correct_answer))}
            </label>
          </div>
        </div>
      ))}
    
          {allOptionsSelected && !showAnswer && showButton &&
         <button onClick={checkAnswer}>Check Answers</button>}
 
      
      {showAnswer && (
        <div>
          <button onClick={refreshPage}>Play Again</button>
          <p>You scored {score}/{questions.length}</p>
        </div>
      )}
    </div>
  );
}

/*
code written by chatGPT
import React from "react";
import { decodeEntity } from 'html-entities';
import { decode } from 'html-entities';

export default function QUESTIONSPage() {
  const [questions, setQuestions] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=21&difficulty=medium&type=multiple")
      .then(res => res.json())
      .then(data => {
        const formattedQuestions = data.results.map(question => ({
          ...question,
          selectedOption: "",
          isWrongAnswer: false
        }));
        setQuestions(formattedQuestions);
      });
  }, []);

  function handleRadioChange(questionIndex, answerIndex, optionValue) {
    setQuestions(prevQuestions => {
      const updatedQuestions = prevQuestions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            selectedOption: optionValue,
            isWrongAnswer: optionValue !== question.correct_answer
          };
        }
        return question;
      });
      return updatedQuestions;
    });
  }

  function checkAnswer() {
  
        setShowAnswer(true);
        const correctAnswers = questions.filter(que => que.correct_answer === que.selectedOption);
        setScore(correctAnswers.length);
      
  }

  return (
    <div className="container">
      {questions.map((que, groupIndex) => {
        return (
          <div key={groupIndex}>
            <h5>{que.question}</h5>
            <div className="options">
              {que.incorrect_answers.map((answer, answerIndex) => {
                const id = `radio${answerIndex}-${groupIndex}`;
                return (
                  <div key={answerIndex}>
                    <input
                      type="radio"
                      value={answer}
                      name="radios"
                      id={id}
                      onChange={() => handleRadioChange(groupIndex, answerIndex, answer)}
                    />
                    <label
                      style={{
                        backgroundColor:
                          showAnswer &&
                          que.selectedOption &&
                          (que.selectedOption === answer
                            ? 'red'
                            : que.correct_answer === answer
                            ? 'green'
                            : 'transparent'),
                      }}
                      htmlFor={id}
                    >
                      {`${answer}`}
                    </label>
                  </div>
                );
              })}
              <input
                type="radio"
                value={que.correct_answer}
                name="radios"
                id={groupIndex}
                onChange={() => handleRadioChange(groupIndex, 'correct', que.correct_answer)}
              />
              <label
                style={{
                  backgroundColor:
                    showAnswer &&
                    que.selectedOption &&
                    que.correct_answer === que.selectedOption
                      ? 'green'
                      : 'transparent',
                }}
                htmlFor={groupIndex}
              >
                {`${que.correct_answer}`}
              </label>
            </div>
          </div>
        );
      })}
      <button onClick={checkAnswer}>Check Answer</button>
      {showAnswer && (
        <p>
          You scored {score} from {questions.length}
        </p>
      )}
    </div>
  );
}
*/

/*
import React from "react";
import { decodeEntity, decode } from 'html-entities';

export default function QUESTIONSPage() {
  const [questions, setQuestions] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [allOptionsSelected, setAllOptionsSelected] = React.useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(null);

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=21&difficulty=medium&type=multiple")
      .then(res => res.json())
      .then(data => {
        const formattedQuestions = data.results.map(question => {
          return { ...question, selectedOption: "" };
        });
        setQuestions(formattedQuestions);
      });
  }, []);

  React.useEffect(() => {
    const areAllOptionsSelected = questions.every(que => que.selectedOption !== "");
    setAllOptionsSelected(areAllOptionsSelected);
  }, [questions]);

  function handleRadioChange(questionIndex, optionValue) {
    const updatedArray = [...questions];
    updatedArray[questionIndex.groupIndex].selectedOption = optionValue;
    setQuestions(updatedArray);
    setSelectedOptionIndex(questionIndex.groupIndex);
  }

  function checkAnswer() {
    setShowAnswer(true);
    const correctAnswers = questions.filter(que => que.correct_answer === que.selectedOption);
    setScore(correctAnswers.length);
  }

  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="container">
      {questions.map((que, groupIndex) => {
        return (
          <div key={groupIndex}>
            <h5>{decodeEntity(decode(que.question))}</h5>
            <div className="options">
              {que.incorrect_answers.map((answer, index) => {
                const id = `radio${index}-${groupIndex}`;
                const isSelected = selectedOptionIndex === groupIndex && que.selectedOption === answer;
                return (
                  <div key={index}>
                    <input
                      type="radio"
                      value={answer}
                      name="radios"
                      id={id}
                      onChange={() => handleRadioChange({ groupIndex, answerIndex: index }, answer)}
                    />
                    <label
                      style={{
                        backgroundColor: isSelected ? "red" : "transparent"
                      }}
                      htmlFor={id}
                    >
                      {`${decodeEntity(answer)}`}
                    </label>
                  </div>
                );
              })}
              <input
                type="radio"
                value={que.correct_answer}
                name="radios"
                id={groupIndex}
                onChange={() => handleRadioChange({ groupIndex, answerIndex: 'correct' }, que.correct_answer)}
              />
              <label
                style={{
                  backgroundColor: selectedOptionIndex === groupIndex && que.selectedOption === que.correct_answer ? "red" : "transparent"
                }}
                htmlFor={groupIndex}
              >
                {`${decodeEntity(que.correct_answer)}`}
              </label>
            </div>
          </div>
        );
      })}
      {!showAnswer && (
        <button onClick={checkAnswer} disabled={!allOptionsSelected}>
          Check Answer
        </button>
      )}
      {showAnswer && <button onClick={refreshPage}>Play Again</button>}
      {showAnswer && <p>you scored {score}/{questions.length}</p>}

*/