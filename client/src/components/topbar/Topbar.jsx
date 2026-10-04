import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { imageBaseUrl } from "../../apiClient";

export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = imageBaseUrl;
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/profile/${searchQuery.trim()}`); // Navigate to the profile URL
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">R V College of Engineering</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the search input state
            onKeyPress={handleKeyPress} // Trigger navigation on Enter key press
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          {/* <span className="topbarLink">Timeline</span> */}
        </div>
        <div className="topbarIcons">
          
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImage"
          />
        </Link>
        <span>{user.username}</span>
      </div>
    </div>
  );
}
