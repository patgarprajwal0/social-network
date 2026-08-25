import "./closeFriend.css"
import { imageBaseUrl } from "../../apiClient";

export default function CloseFriend({user}) {
  const PF = imageBaseUrl;

  return (
    <li className="sidebarFriend">
        <img className="sidebarFriendImg" src={PF+user.profilePicture} alt=""/>
        <span className="sidebarFriendName">{user.username}</span>
    </li>
  )
}
