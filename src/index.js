import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './index.css'

import DA from './lib/data'
import setup from './lib/initial-setup'

setup(DA({
  apiKey: 'AIzaSyAHVjtVyv3jPGH2psPCuRZdBYhcpPwuzIY',
  authDomain: 'amigo-secreto-quiros-2019.firebase.com',
  databaseURL: 'https://amigo-secreto-quiros-2019.firebaseio.com',
  projectId: 'amigo-secreto-quiros-2019'
}))

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();