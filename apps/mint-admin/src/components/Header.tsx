import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "./ui/avatar";
import { Button } from "./ui/button";

export default function Header() {
  const { user, logout } = useAuth();

  function getNavLinksFromUserRole() {
    return <>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/races">Courses</Link></li>
    </>
    switch(user?.role) {
      case "coureur":
        return <>
          <Link to="/">Home</Link>
        </>
      case "organisateur":
        return<>
        </>
      default:
        return <></>
    }
  }

  return (
    <header className="h-18 px-8 shadow-md flex items-center justify-between">
      <nav>
        {
          <ul className="flex gap-4">{getNavLinksFromUserRole()}</ul>
        }
      </nav>
      {
        !user ?
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/auth/register">register</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/login">login</Link>
            </Button>
          </div> :
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
                  <Avatar className="rounded-lg">
                    <AvatarImage
                      src={undefined}
                      alt={`${user.firstname} ${user.lastname}'s avatar`}
                    />
                    <AvatarFallback>aa</AvatarFallback>
                  </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link to="/me/organizations">Mes organisations</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      }
    </header>
  )
}