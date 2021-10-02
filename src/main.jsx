import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { START_PROCESS } from './constants.js';
import MainForm from './ui/MainForm.jsx';
import Started from './ui/Started.jsx';
import Progress from './ui/Progress.jsx';
import Success from './ui/Success.jsx';

const api = window.api;

const {
  PROCESS_STARTED,
  PROCESS_FINISHED,
  UPDATE_PROCESS_STATUS,
} = api.events;

const container = document.getElementById('container');

api.receive(PROCESS_STARTED, (fileName) => {
  ReactDOM.render(<React.StrictMode><Started fileName={fileName}/></React.StrictMode>, container);
});

api.receive(PROCESS_FINISHED, (data) => {
  ReactDOM.render(<React.StrictMode><Success data={data}/></React.StrictMode>, container);
});

api.receive(UPDATE_PROCESS_STATUS, (data) => {
  ReactDOM.render(<React.StrictMode><Progress data={data}/></React.StrictMode>, container);
});

function handleSubmit(file) {
  api.send(START_PROCESS, file.path);
}

function render() {
  ReactDOM.render(<React.StrictMode><MainForm handleSubmit={handleSubmit} /></React.StrictMode>, container);
}

render();