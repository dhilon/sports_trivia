import { useState } from 'react'
import { Button } from "@/components/ui/button"

import { Link, Switch } from "wouter";
import { Router, Route, useParams } from "wouter";
import LoginPage from '@/Login';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NavSidebar } from '@/NavSidebar';
import SignupPage from './Signup';
import LeaderboardPage from './Leaderboard';
import FriendsPage from './Friends';
import { navigate } from 'wouter/use-browser-location';
import GamesPage from './Games';
import InboxPage from './Inbox';
import PasswordPage from './Password';


const HomePage = () => {
  const [count, setCount] = useState(0)
  return (
    <SidebarLayout>
      <div className="grid gap-2">


        <Link href="/users/1">Profile</Link>

        <Button className="" onClick={() => setCount((count) => count + 1)}>Count is {count}</Button>
        <Button type="submit" onClick={() => navigate("/games")}>Play</Button>
      </div>
    </SidebarLayout>

  )

};

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
        <Route path="/inbox" component={InboxPage}></Route>
        <Route path="/login" component={LoginPage}></Route>
        <Route path="/signup" component={SignupPage}></Route>
        <Route path="/password" component={PasswordPage}></Route>
        <Route path="/leaderboard/:name" component={LeaderboardPage}></Route>
        <Route path="/friends" component={FriendsPage}></Route>
        <Route path="/games" component={GamesPage}></Route>
      </Router>

    </Switch>
  )
}

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <NavSidebar />
      <main className='flex flex-col relative'>
        <SidebarTrigger />
        <div className='w-full'>{children}</div>

      </main>
    </SidebarProvider>
  )
}


export default App
