import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { START_PROCESS } from './constants.js';
import MainForm from './ui/MainForm.jsx';

const api = window.api;

const {
  PROCESS_STARTED,
  PROCESS_FINISHED,
  UPDATE_PROCESS_STATUS,
} = api.events;

api.receive(PROCESS_STARTED, (a, b) => {
  //render loading screen
})

api.receive(PROCESS_FINISHED, () => {
  //render success screen
})

api.receive(UPDATE_PROCESS_STATUS, (event, data) => {
  //progress screen
})

function handleSubmit(file) {
  api.send(START_PROCESS, file.path);
}

function render() {
  ReactDOM.render(<MainForm handleSubmit={handleSubmit} />, document.getElementById('container'));
}

render();