import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { START_PROCESS } from './constants.js';
import MainForm from './ui/MainForm.jsx';
import Started from './ui/Started.jsx';
import Progress from './ui/Progress.jsx';

const api = window.api;

const {
  PROCESS_STARTED,
  PROCESS_FINISHED,
  UPDATE_PROCESS_STATUS,
} = api.events;

api.receive(PROCESS_STARTED, (fileName) => {
  ReactDOM.render(<Started fileName={fileName}/>, document.getElementById('container'));
})

api.receive(PROCESS_FINISHED, (data) => {
  ReactDOM.render(<><h3>Sucesso!</h3><p>Arquivo salvo em {data}</p></>, document.getElementById('container'));
})

api.receive(UPDATE_PROCESS_STATUS, (data) => {
  ReactDOM.render(<Progress data={data}/>, document.getElementById('container'));
})

function handleSubmit(file) {
  api.send(START_PROCESS, file.path);
}

function render() {
  ReactDOM.render(<MainForm handleSubmit={handleSubmit} />, document.getElementById('container'));
}

render();