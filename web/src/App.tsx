import { Switch } from "wouter";
import { Router, Route } from "wouter";
import LoginPage from '@/Login';
import SignupPage from './Signup';
import ProfilePage from './Profile';
import FriendsPage from './Friends';
import GamesPage from './Games';
import PasswordPage from './Password';
import GamelogPage from './Gamelog';
import PyramidPage from './Pyramid';
import RapidFire from './RapidFire';
import ResultsPage from './Results';
import HomePage from './Home';
import { SWRConfig } from "swr";
import axios from 'axios';
import AroundTheHorn from "./AroundTheHorn";
import LeaderboardPage from "./Leaderboard";

function App() {

  const fetcher = async (url: string) => {
    axios.defaults.withCredentials = true;
    const instance = axios.create({
      baseURL: 'http://localhost:5000/',
      timeout: 1000,
    });
    const response = (await instance.get(url)).data
    return response
  };

  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        fetcher
        // provider: () => new Map(),
        // dedupingInterval: 2000,
        // keepPreviousData: true
      }}
    >
      <Switch>

        <Router base="/">
          <Route path="/" component={HomePage}></Route>
          <Route path="/home" component={HomePage}></Route>
          <Route path="/gamelog/:name" component={GamelogPage}></Route>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/leaderboard" component={LeaderboardPage}></Route>
          <Route path="/signup" component={SignupPage}></Route>
          <Route path="/password" component={PasswordPage}></Route>
          <Route path="/profile/:name" component={ProfilePage}></Route>
          <Route path="/friends/" component={FriendsPage}></Route>
          <Route path="/games/:sport" component={GamesPage}></Route>
          <Route path="/games/:sport/tower_of_power/:id" component={PyramidPage}></Route>
          <Route path="/games/:sport/around_the_horn/:id" component={AroundTheHorn}></Route>
          <Route path="/games/:sport/rapid_fire/:id" component={RapidFire}></Route>
          <Route path="/games/:sport/:type/:id/results" component={ResultsPage}></Route>
        </Router>

      </Switch>
    </SWRConfig>
  )
}


export default App
