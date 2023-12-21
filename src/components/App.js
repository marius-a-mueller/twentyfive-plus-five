import React from "react";

import Label from "./Label";
import BigLabel from "./BigLabel";
import Button from "./Button";

const TIME_STATES = ["BREAK", "SESSION"];
const OPERATIONS = ["INCREMENT", "DECREMENT"];
const INITIAL_STATE = {
  sessionLength: 25,
  breakLength: 5,
  timerRunning: false,
  timeLeft: new Date(25 * 60000),
  timeState: TIME_STATES[1],
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

  getTimeLeftAsString() {
    return this.state.timeLeft.toISOString().slice(14, 19);
  }

  countDown() {
    this.setState((state) => ({ timeLeft: new Date(state.timeLeft - new Date(1000)) }));
  }

  handleStartStop() {
    if (!this.timer) {
      this.timer = setInterval(this.countDown, 1000);
    } else {
      clearInterval(this.timer);
      this.timer = undefined;
    }

    this.setState((state) => {
      return { timerRunning: !state.timerRunning };
    });
  }

  handleReset() {
    this.setState(INITIAL_STATE);
    clearInterval(this.timer);
    this.timer = undefined;
  }

  handleNumberChange(event) {
    if (this.state.timerRunning) return;
    const id = event.target.parentElement.id;
    let operation = 0;

    if (id.toUpperCase().includes(OPERATIONS[0]) && this.state.breakLength < 60) {
      operation++;
    } else if (id.toUpperCase().includes(OPERATIONS[1]) && this.state.sessionLength > 1) {
      operation--;
    }

    if (id.toUpperCase().includes(TIME_STATES[0])) {
      this.setState((state) => {
        return {
          breakLength: state.breakLength + operation,
        };
      });
    } else if (id.toUpperCase().includes(TIME_STATES[1])) {
      this.setState((state) => {
        return { sessionLength: state.sessionLength + operation };
      });
    }
  }

  render() {
    return (
      <div className={"w-screen h-screen flex flex-col justify-center items-center bg-green-900"}>
        <div className="p-5 rounded-md shadow-md flex flex-col justify-center items-center bg-green-700">
          <div className="flex flex-row">
            <div className="p-2 flex flex-col">
              <Label id="break-label" text="Break Length" customClass="font-bold" />
              <div className="flex flex-row justify-center">
                <Button id="break-increment" icon="fa-solid fa-arrow-up" callback={this.handleNumberChange} />
                <Label id="break-length" text={this.state.breakLength} />
                <Button id="break-decrement" icon="fa-solid fa-arrow-down" callback={this.handleNumberChange} />
              </div>
            </div>
            <div className="p-2 flex flex-col">
              <Label id="session-label" text="Session Length" customClass="font-bold" />
              <div className="flex flex-row justify-center">
                <Button id="session-increment" icon="fa-solid fa-arrow-up" callback={this.handleNumberChange} />
                <Label id="session-length" text={this.state.sessionLength} />
                <Button id="session-decrement" icon="fa-solid fa-arrow-down" callback={this.handleNumberChange} />
              </div>
            </div>
          </div>
          <Label
            id="timer-label"
            text={this.state.timeState === TIME_STATES[1] ? "Session" : "Break"}
            customClass="font-bold"
          />
          <BigLabel id="time-left" text={this.getTimeLeftAsString()} />
          <div className="flex flex-row">
            <Button
              id="start-stop"
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
