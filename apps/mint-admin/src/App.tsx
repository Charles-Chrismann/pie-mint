import './App.css'
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function App() {

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}