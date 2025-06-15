import "./Navbar.css";
import { Link, useRouteContext } from "@tanstack/react-router";
import { NavbarDropdown } from "./NavbarDropdown";
import { Button, IconButton } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { keycloak } from "@/api/keycloak";
import { useDropdown } from "@/hooks/useDropdown";

export const Navbar = () => {
  const { auth } = useRouteContext({ strict: false });

  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <Link to='/' className='logo'>
          <img src='/tasksynclogo.svg' />
          <span>TaskSync</span>
        </Link>
      </div>
      <div className='navbar-center'></div>
      <div className='navbar-right'>
        {auth && auth.isAuthenticated && <Link to='/board'>Boards</Link>}
        <DarkModeToggle />
        <UserProfile auth={auth} />
      </div>
    </nav>
  );
};

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      variant='ghost'
      size='icon'
      icon={
        theme === "dark"
          ? "material-symbols:light-mode-outline-rounded"
          : "material-symbols:dark-mode-outline-rounded"
      }
    />
  );
};

const UserProfile = ({ auth }: { auth: any }) => {
  const { isOpen, toggle: toggleDropdown, modalRef: dropdownRef, triggerRef } = useDropdown();

  const handleLogin = async () => {
    try {
      await keycloak.login({
        redirectUri: window.location.href,
      });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  if (auth.isAuthenticated) {
    return (
      <>
        <div
          className='user-profile'
          onClick={toggleDropdown}
          ref={triggerRef as React.RefObject<HTMLDivElement>}
        >
          {auth.user.picture ? (
            <img src={auth.user.picture.toString()} className='profile-img' />
          ) : (
            auth.user.username?.charAt(0).toUpperCase()
          )}
        </div>
        {isOpen && <NavbarDropdown ref={dropdownRef} />}
      </>
    );
  }

  return (
    <Button onClick={handleLogin} variant='primary' rounded='sm' fs='sm'>
      Log In
    </Button>
  );
};
