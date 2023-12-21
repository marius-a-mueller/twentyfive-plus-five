import React from "react";

import Label from "./Label";
import BigLabel from "./BigLabel";
import Button from "./Button";

const toSeconds = (minutes) => minutes * 60;
const toTimeString = (seconds) => `${pad(Math.floor(seconds / 60), 2)}:${pad(seconds % 60, 2)}`;
const pad = (num, size) => ("00000" + num).slice(-size);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TIME_STATES = {
  session: 0,
  break: 1,
};
const OPERATIONS = {
  increment: 1,
  decrement: -1,
};
const INITIAL_STATE = {
  session: 25, // minutes
  break: 5, // minutes
  timerRunning: false,
  timeLeft: toSeconds(25),
  timeState: TIME_STATES.session,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.countDown = this.countDown.bind(this);
    this.getTimeLeftAsString = this.getTimeLeftAsString.bind(this);
  }

  async playAudio(ms) {
    let audio = document.getElementById("beep");
    audio.play();
    await delay(2000);
  }

  pauseAudio() {
    let audio = document.getElementById("beep");
    audio.pause();
    audio.load();
  }

  getTimeLeftAsString() {
    return toTimeString(this.state.timeLeft);
  }

  startTimer() {
    this.timer = setInterval(this.countDown, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  async countDown() {
    this.setState((state) => ({ timeLeft: state.timeLeft - 1 }));
    if (this.getTimeLeftAsString() === "00:00") {
      this.stopTimer();
      await this.playAudio(2000);
      if (this.state.timeState === TIME_STATES.session) {
        console.log(this.state);
        this.setState((state) => ({ timeLeft: toSeconds(state.break), timeState: TIME_STATES.break }));
      } else {
        this.setState((state) => ({ timeLeft: toSeconds(state.session), timeState: TIME_STATES.session }));
      }
      this.startTimer();
    }
  }

  handleStartStop() {
    if (!this.timer) {
      this.startTimer();
    } else {
      this.stopTimer();
    }

    this.setState((state) => {
      return { timerRunning: !state.timerRunning };
    });
  }

  handleReset() {
    this.setState(INITIAL_STATE);
    this.stopTimer();
    this.pauseAudio();
  }

  handleNumberChange(event) {
    if (this.state.timerRunning) return;
    const id = event.target.id;
    // e.g. break-increment => ["break", "increment"]
    let splitArray = id.split("-");
    let timeState = splitArray[0];
    let operation = splitArray[1];
    let op_number = OPERATIONS[operation];

    if (this.state[timeState] > -op_number && this.state[timeState] <= 60 - op_number) {
      // max length for session or break
      this.setState((state) => ({ [timeState]: state[timeState] + op_number }));
      // set label for current session or break
      if (this.state.timeState === TIME_STATES[timeState]) {
        this.setState((state) => ({ timeLeft: toSeconds(state[timeState]) }));
      }
    }
  }

  render() {
    return (
      <div className={"w-screen h-screen flex flex-col justify-center items-center bg-green-900"}>
        <audio id="beep" src="https://assets.mixkit.co/active_storage/sfx/1084/1084-preview.mp3"></audio>
        <div className="p-5 rounded-md shadow-md flex flex-col justify-center items-center bg-green-700">
          <div className="flex flex-row">
            <div className="p-2 flex flex-col">
              <Label id="break-label" text="Break Length" customClass="font-bold" />
              <div className="flex flex-row justify-center">
                <Button id="break-increment" icon="fa-solid fa-arrow-up" callback={this.handleNumberChange} />
                <Label id="break-length" text={this.state.break} />
                <Button id="break-decrement" icon="fa-solid fa-arrow-down" callback={this.handleNumberChange} />
              </div>
            </div>
            <div className="p-2 flex flex-col">
              <Label id="session-label" text="Session Length" customClass="font-bold" />
              <div className="flex flex-row justify-center">
                <Button id="session-increment" icon="fa-solid fa-arrow-up" callback={this.handleNumberChange} />
                <Label id="session-length" text={this.state.session} />
                <Button id="session-decrement" icon="fa-solid fa-arrow-down" callback={this.handleNumberChange} />
              </div>
            </div>
          </div>
          <Label
            id="timer-label"
            text={this.state.timeState === TIME_STATES.session ? "Session" : "Break"}
            customClass="font-bold"
          />
          <BigLabel id="time-left" text={this.getTimeLeftAsString()} />
          <div className="flex flex-row">
            <Button
              id="start_stop"
              icon={this.state.timerRunning ? "fa-solid fa-circle-stop" : "fa-solid fa-circle-play"}
              callback={this.handleStartStop}
            />
            <Button id="reset" icon="fa-solid fa-arrow-rotate-left" callback={this.handleReset} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
