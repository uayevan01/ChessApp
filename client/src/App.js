import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Homepage from './components/Homepage.js'
import Gamepage from './components/Gamepage.js'
import Navbar from './components/Navbar.js'

function App() {
  return (
    <Router>
      <body>
      <Navbar/>
      <Switch>
          {/* HomePage */}
          <Route exact path="/" component={Homepage}/>
          <Route path='/play' component={Gamepage}/>
        </Switch>
      </body>
    </Router>
  );
}

export default App;
