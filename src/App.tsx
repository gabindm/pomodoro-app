import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer
        pomodoroTime={1500}
        shortRestTime={300}
        longRestTime={900}
        workingTime={28800}
        cycles={4}
      />
    </div>
  );
}

// function App(): JSX.Element {
//   return (
//     <div className="container">
//       <PomodoroTimer
//         pomodoroTime={5}
//         shortRestTime={2}
//         longRestTime={5}
//         workingTime={15}
//         cycles={4}
//       />
//     </div>
//   );
// }

export default App;
