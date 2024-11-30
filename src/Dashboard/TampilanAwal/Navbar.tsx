import { Component } from "solid-js";
import { Link, useNavigate } from "@solidjs/router";
import ThemeToggle from './dark&light_mode'; // Ensure this path is correct
import './navbar.css';

const Navbar: Component<{ onSearch: (query: string) => void }> = (props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      const response = await fetch("http://localhost:8080/pengguna/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
  
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Failed to log out. Please try again.");
      }
    } else {
      alert("No user is logged in");
    }
  };  

  const handleSearch = (event: Event) => {
    event.preventDefault();
    const searchInput = (event.target as HTMLFormElement).search.value;
    props.onSearch(searchInput);  // Call the onSearch function passed from the parent
  };

  return (
    <nav class="navbar">
      <div class="navbar-logo">
        <a href="/">My Dashboard</a>
      </div>
      <ul class="navbar-links">
        <li><Link href="/Dashboard">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/GoogleMaps">MAPS</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
        
        <li>
        <form class="navbar-search" onSubmit={handleSearch}>
         <input type="text" name="search" placeholder="Search..." />
        </form>
        </li>

        <li><ThemeToggle /></li> 
      </ul>
    </nav>
  );
};

export default Navbar;
