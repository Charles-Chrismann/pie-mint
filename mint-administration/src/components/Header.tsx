import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="h-18 px-8 shadow-md flex items-center">
      <nav>
        <ul>
          <li className="flex">
            <Link to="/organizations">Organisations</Link>
            {/* <Link to="/me/organizations">Mes organisations</Link> */}
          </li>
        </ul>
      </nav>
    </header>
  )
}