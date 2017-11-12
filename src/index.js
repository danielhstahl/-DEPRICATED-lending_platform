import React from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import firebase from 'firebase'
import 'firebase/firestore'
//import './index.css'
import App from './App'
import { reduxFirestore } from 'redux-firestore'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter as Router,  Route} from 'react-router-dom'
import lendingApp from './reducers'
import {config, localConfig} from './FirebaseConfig/config'

firebase.initializeApp(config)
firebase.firestore() //to use firestore
  
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, localConfig), // firebase instance as first argument
    reduxFirestore(firebase) // <- needed if using firestore
  )(createStore)
  
// Create store with reducers and initial state
const store = createStoreWithFirebase(lendingApp)

ReactDOM.render(<Provider store={store}>
    <Router>
        <Route path='/' component={App}/>
    </Router>
  </Provider>, document.getElementById('root'));
registerServiceWorker();
