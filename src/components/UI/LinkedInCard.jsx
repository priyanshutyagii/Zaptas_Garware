import { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import { FaThumbsUp } from 'react-icons/fa';

import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import showToast from "../../utils/toastHelper";

export default function LinkedInCard() {
  const [posts, setPosts] = useState([]);
  const [loggin, setloggin] = useState(false)
  // Function to fetch LinkedIn posts
  const fetchPosts = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/fetchOrgPosts?start=0&count=3&show=posts,multimedia,likeStatus,text,likeCount,id`;
      const token = getTokenFromLocalStorage();
      console.log(token)
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success) {
        setPosts(response?.data?.posts);
      } else {
        if (!response.success && response.errorMessage == 'loginRequired') {
          setloggin(true)
          showToast("You need to Logged in first", 'success')
          return
        }
        showToast("failed to load posts", 'error')
      }

    } catch (error) {
      showToast("failed to load posts", 'error')
      console.error("Error fetching posts:", error.message);
      setPosts([]);
    }
  };

  // UseEffect to call fetchPosts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    return words.slice(0, wordLimit).join(' ') + (words.length > wordLimit ? '...' : '');
  }


  const handleLikeToggle = async (postId, method) => {
    try {
      // Get the authentication token
      const token = getTokenFromLocalStorage();

      // Construct the URL for the like/unlike API call
      const url = `${ConnectMe.BASE_URL}/${method}`;  // Replace with your actual API endpoint for liking/unliking posts

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Prepare the body for the request
      const Passed = {
        // postId: `urn:li:share:${postId}`
        postId: `${postId}`
      }
      const body = JSON.stringify(
        Passed
      );

      // Make the API call to like or unlike the post
      await apiCall("POST", url, headers, body);

      // Update UI based on the response

      // Update the state or handle UI changes after successful like/unlike

      // Example: Update state, toggle like button appearance, etc.
      fetchPosts(); // Re-fetch posts or update the like status of the post locally

    } catch (error) {
      console.error("Error liking/unliking post:", error.message);
    }
  };

  const handleLinkedInCallback = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/auth/linkedin`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success) {
        showToast("Login Success", "success");
        const authUrl = `${response.data}`;
        // Open the LinkedIn authorization URL in a new tab
        console.log(authUrl)
        
         window.open(authUrl, "_blank");
      } else {
        showToast("Login Failed", "error");
        console.error("LinkedIn login failed:", response.message);
      }
    } catch (error) {
      showToast("Login Failed", "error");
      console.error("Error during LinkedIn login:", error.message);
    }
  };



  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaLinkedin className="me-2" />
          <h5 className="mb-0">LinkedIn </h5>
        </div>
        <a href="#" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      {loggin ? <button onClick={handleLinkedInCallback}>Login with linkedin</button> :
        <div className="card-body">
          {posts && posts.map((post) => (
            <div key={post.id} className="d-flex align-items-start mb-3">
              <div className="csr-media">
                {post.multimedia.type === "image" ? (
                  <img
                    src={post.multimedia.url}
                    alt="CSR"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : post.multimedia.type === "video" ? (
                  <video
                    width="100"
                    height="100"
                    controls
                    autoPlay
                    muted // Optional: Mute the video to allow autoplay on some browsers
                    loop   // Optional: Loop the video
                  >
                    <source src={post.multimedia.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>


              <div className="announcement-disc ms-2">
                <p className="card-text fs-6">{truncateText(post.text, 12)}</p>
                <p className="card-text fs-6" >

                  <FaThumbsUp style={{ color: post?.fetchUserLikesStatus ? 'blue' : 'gray' }} onClick={(() => { handleLikeToggle(post.id, post?.fetchUserLikesStatus ? 'disslike' : "likePost") })} />{post?.likeCount?.totalLikes}</p>
                <a href="#" className="text-decoration-none">
                  Read More +
                </a>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}
