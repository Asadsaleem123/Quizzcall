import React from "react";
export default function StartQuiz(props){
    return (
        <div className="first--page">
           <h1>QuizzCall</h1>
           <p>Some description if needed</p>
           <button onClick={()=>props.navigateScreen("questions")}>Start Quiz</button>
           <div className="top-right-effect"></div>
           <div className="bottom-left-effect"></div>
        </div>
    )
}