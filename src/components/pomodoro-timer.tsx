import React, { useEffect, useState, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToTime } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';
import moment from 'moment';

const bellStart = require('../sounds/bell-start.mp3');
const bellFinish = require('../sounds/bell-finish.mp3');
const endWorkingTime = require('../sounds/level-complete.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);
const audioEndWorkingTime = new Audio(endWorkingTime);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  workingTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesManager, setCyclesManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useInterval(
    () => {
      setMainTime(mainTime - 1);

      if (working) setFullWorkingTime(fullWorkingTime + 1);
      if (fullWorkingTime === props.workingTime) {
        audioEndWorkingTime.play();
      }

      setEnd(
        moment()
          .add(props.workingTime - fullWorkingTime, 'seconds')
          .utcOffset(-3)
          .format('YYYY-MM-DD HH:mm:ss'),
      );
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    if (!fullWorkingTime)
      setStart(moment().utcOffset(-3).format('YYYY-MM-DD HH:mm:ss'));
    audioStartWorking.play();
  }, [
    fullWorkingTime,
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    setStart,
    props.pomodoroTime,
    props.workingTime,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(props.longRestTime);
      } else setMainTime(props.shortRestTime);

      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
    if (mainTime > 0) return;

    if (working && cyclesManager.length > 0) {
      configureRest(false);
      cyclesManager.pop();
    } else if (working && cyclesManager.length <= 0) {
      configureRest(true);
      setCyclesManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesManager,
    numberOfPomodoros,
    completedCycles,
    configureRest,
    setCyclesManager,
    configureWork,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text="Rest"
          onClick={() => configureRest(false)}
        ></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>

      <div className="details">
        <p>
          <b>Working hours done:</b> {secondsToTime(fullWorkingTime)}
        </p>
        <p>
          <b>Extra hours:</b>{' '}
          {fullWorkingTime > props.workingTime
            ? secondsToTime(fullWorkingTime - props.workingTime)
            : secondsToTime(0)}
        </p>
        <p>
          <b>Pomodoros done:</b> {numberOfPomodoros}
        </p>
        <p>
          <b>Cycles done:</b> {completedCycles}
        </p>
        <p className="start">
          <i>Started at: {start}</i>
        </p>
        <p className="end">
          <i>Should end at: {end}</i>
        </p>
      </div>
    </div>
  );
}
