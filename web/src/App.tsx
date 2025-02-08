import { useState } from 'react'
import { Button } from "@/components/ui/button"

import { Link, Switch } from "wouter";
import { Router, Route, useParams } from "wouter";
import { useRoute } from "wouter";
import { useLocation } from "wouter";
import LoginPage from '@/Login';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NavSidebar } from '@/navSidebar';


const CurrentLocation = () => {
  const [location, navigate] = useLocation();

  return (
    <div>
      {`The current page is: ${location}`}
      <a onClick={() => navigate("/home")}>Click to update</a>
    </div>
  );
};

const Users = () => {
  // `match` is a boolean
  const [match, params] = useRoute("/users/:name");

  if (match) {
    return <>Hello, {params.name}!</>;
  } else {
    return null;
  }
};

const InboxPage = () => (
  <>
    <Link href="/users/2">Monkey</Link>

    <Route path="/about">About Us</Route>

    {/* 
      Routes below are matched exclusively -
      the first matched route gets rendered
    */}
    <Switch>

      <Route path="/users/:name">
        {(params) => <>Hello, {params.name}!</>}
      </Route>

      {/* Default route in a switch */}
    </Switch>
  </>
);

const HomePage = () => {
  const [count, setCount] = useState(0)
  return (
    <AppLayout>
      <div>


        <Link href="/users/1">Profile</Link>

        <Button className="" onClick={() => setCount((count) => count + 1)}>Count is {count}</Button>
      </div>
    </AppLayout>

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
      </Router>

    </Switch>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
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

<Route path="/inbox" component={InboxPage}></Route>


export default App
