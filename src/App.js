import React from 'react';
import './App.css';
import StartQuiz from './components/StartQuiz';
import QuestionsPage from './components/QuestionsPage';
import checkAnswersPage from './components/CheckAnswersPage';
import {encode} from 'html-entities';
encode('< > " \' & © ∆');
// -> '&lt; &gt; &quot; &apos; &amp; © ∆'

encode('< ©', {mode: 'nonAsciiPrintable'});
// -> '&lt; &copy;'

encode('< ©', {mode: 'nonAsciiPrintable', level: 'xml'});
// -> '&lt; &#169;'

function App() {
  const [currentScreen,SetCurrentScreen]=React.useState("start")
  const navigateScreen = (screen)=>{
    SetCurrentScreen(screen)
  }
  return (
    <div className='App'>
      {currentScreen==="start" && <StartQuiz navigateScreen={navigateScreen} />}
      {currentScreen==="questions" && <QuestionsPage navigateScreen={navigateScreen}/> }
      {currentScreen==="checkAnswers" && <checkAnswersPage navigateScreen={navigateScreen}/>}
    </div>
  );
}

export default App;
