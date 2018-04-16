import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App style={{width:'100%', height:'100%'}} />, document.getElementById('root'));
registerServiceWorker();