import { useState } from 'react'
import { Button } from "@/components/ui/button"

import { Switch } from "wouter";
import { Router, Route, useParams } from "wouter";
import LoginPage from '@/Login';
import SignupPage from './Signup';
import ProfilePage from './Profile';
import FriendsPage from './Friends';
import GamesPage from './Games';
import PasswordPage from './Password';
import GamelogPage from './Gamelog';
import PyramidPage from './Pyramid';
import BackandForth from './BackandForth';
import RapidFire from './RapidFire';
import ResultsPage from './Results';
import HomePage from './Home';


const AdminPage = () => {
  const [count, setCount] = useState(0)
  const params = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen">


      Hello, {params.name}!

      <Button className="" onClick={() => setCount((count) => count + 1)}>Count is {count}</Button>
    </div>
  )

};

function App() {

  return (
    <Switch>

      <Router base="/">
        <Route path="/" component={HomePage}></Route>
        <Route path="/home" component={HomePage}></Route>
        <Route path="/admin/:name" component={AdminPage} />
        <Route path="/gamelog" component={GamelogPage}></Route>
        <Route path="/login" component={LoginPage}></Route>
        <Route path="/signup" component={SignupPage}></Route>
        <Route path="/password" component={PasswordPage}></Route>
        <Route path="/profile/:name" component={ProfilePage}></Route>
        <Route path="/friends" component={FriendsPage}></Route>
        <Route path="/games/:sport" component={GamesPage}></Route>
        <Route path="/pyramid/:sport" component={PyramidPage}></Route>
        <Route path="/back_and_forth/:sport" component={BackandForth}></Route>
        <Route path="/rapid_fire/:sport" component={RapidFire}></Route>
        <Route path="/results" component={ResultsPage}></Route>
      </Router>

    </Switch>
  )
}


export default App
