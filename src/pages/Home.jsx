import { Helmet } from "react-helmet-async";
import FriendRequest from "./../components/FriendRequest/Index.jsx";
import Friends from "./../components/Friends/Index.jsx";
import AllUsers from "./../components/Users/Index.jsx";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="bg-white p-6">
        <div className="grid grid-cols-3 gap-x-8">
          {/* all users */}
          <div className="shadow-md rounded-md p-4">
            <AllUsers />
          </div>
          {/* friend requests */}
          <div className="shadow-md rounded-md p-4">
            <FriendRequest />
          </div>
          {/* all friends */}
          <div className="shadow-md rounded-md p-4">
            <Friends />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
