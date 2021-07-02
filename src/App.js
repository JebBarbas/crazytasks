import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';

import Tasklists from './components/Tasklists';
import Tasklist from './components/Tasklist'
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import PasswordReset from './components/PasswordReset';

import 'bootswatch/dist/superhero/bootstrap.min.css'
import './App.css'

function App() {
    return (
        <Router>
            <Navbar/>
            <div className="container py-3">
                <Switch>
                    <AuthRoute exact path="/" component={Tasklists}></AuthRoute>
                    <AuthRoute path="/list/:tasklistId" component={Tasklist}></AuthRoute>
                    <Route exact path="/login" component={LoginForm}></Route>
                    <Route exact path="/password_reset" component={PasswordReset}></Route>
                    <AuthRoute exact path="/profile" component={Profile}></AuthRoute>
                    <Route component={NotFound}></Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
