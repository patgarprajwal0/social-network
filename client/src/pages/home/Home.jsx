import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Share from "../../components/share/Share"
import "./home.css"

export default function home() {
  return (
    <>
      <Topbar />
        <Share/>
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </> 

  )
}
