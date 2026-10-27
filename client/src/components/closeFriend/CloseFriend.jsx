import "./closeFriend.css"

import { imageUrl } from "../../config";

export default function CloseFriend({user}) {

  return (
    <li className="sidebarFriend">
        <img className="sidebarFriendImg" src={imageUrl(user.profilePicture)} alt=""/>
        <span className="sidebarFriendName">{user.username}</span>
    </li>
  )
}
