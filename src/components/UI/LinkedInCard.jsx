import React, { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import { FaThumbsUp } from 'react-icons/fa';

import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";

export default function LinkedInCard() {
  const [posts, setPosts] = useState([]);

  // Function to fetch LinkedIn posts
  const fetchPosts = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/fetchOrgPosts?start=0&count=3&show=posts,images`;
      const token = getTokenFromLocalStorage();

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      setPosts(response.posts);
    } catch (error) {
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


  const handleLikeToggle = async (postId,method) => {
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
        postId: `urn:li:share:${postId}`
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
      <div className="card-body">
        {posts && posts.map((post) => (
          <div key={post.id} className="d-flex align-items-start mb-3">
            <div className="csrimg">
              <img src={post.imageUrl} alt="CSR" style={{ width: "100px", height: "100px" }} />
            </div>
            <div className="announcement-disc ms-2">
              <p className="card-text fs-6">{truncateText(post.text, 12)}</p>
              <p className="card-text fs-6" >

                <FaThumbsUp style={{ color: post?.fetchUserLikesStatus ? 'blue' : 'gray' }} onClick={(() => { handleLikeToggle(post.id, post?.fetchUserLikesStatus ? 'disslike':"likePost") })} /></p>
              <a href="#" className="text-decoration-none">
                Read More +
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
