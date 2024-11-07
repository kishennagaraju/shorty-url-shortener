import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/db/apiAuth.js";
import { UrlState } from "@/context/url-context";
import useFetch from "@/hooks/use-fetch.js";
import { BarLoader } from "react-spinners";

const Header = () => {
    const navigate = useNavigate();
    const { user, fetchUser } = UrlState();
    const { loading, fn: fnLogout } = useFetch(logout);

    return (
      <>
          <nav className='p-4 flex justify-between items-center'>
              <Link to='/'>
                  <img src='/logo.png' className='h-20' alt='Url Shortener'/>
              </Link>

              <div>
                  {!user && <Button onClick={() => navigate("/auth")}>Login</Button>}
                  {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
                            <Avatar>
                                <AvatarImage src={user?.user_metadata?.profile_pic}/>
                                <AvatarFallback>{user?.user_metadata?.name}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                {user?.user_metadata?.name}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <Link to={'/dashboard'} className={"flex"}>
                                    <LinkIcon className='mr-2 h-4'/>
                                    My Links
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                  fnLogout().then(() => {
                                      fetchUser();
                                      navigate("/auth");
                                  });
                              }}
                              className='text-red-400'>
                                <LogOut className='mr-2 h-4'/>
                                <span>
                                    Logout
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </div>
          </nav>
          {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>}
      </>
    );
};

export default Header;
