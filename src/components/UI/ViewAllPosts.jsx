import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";

export default function ViewAllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To track if there are more posts
  const [page, setPage] = useState(0); // Current page

  // Function to fetch posts
  const fetchPosts = async () => {
    if (!hasMore || loading) return; // Prevent multiple fetches
    setLoading(true);

    try {
      const url = `${ConnectMe.BASE_URL}/fetchOrgPosts?start=${page}&count=5&show=posts,multimedia,likeStatus,text,likeCount,comments`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success) {
        setPosts((prev) => [...prev, ...response?.data?.posts]);
        setHasMore(response?.data?.posts?.length > 0); // Check if more posts are available
        setPage((prev) => prev + 5); // Increment the page
      } else {
        showToast("Failed to fetch posts", "error");
      }
    } catch (error) {
      showToast("Error loading posts", "error");
    } finally {
      setLoading(false);
    }
  };

  // Infinite Scroll: Detect when the user reaches the bottom
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
      hasMore
    ) {
      fetchPosts();
    }
  };

  // Initial Fetch and Event Listener for Scroll
  useEffect(() => {
    fetchPosts(); // Initial fetch
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  return (
    <div className="container mt-3">
      <h2 className="mb-4">View All Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            {/* Post Content */}
            <p>{post.text}</p>
            {/* Like Button */}
            <p>
              <FaThumbsUp
                style={{ color: post?.fetchUserLikesStatus ? "blue" : "gray" }}
              />
              {post.likeCount.totalLikes} Likes
            </p>
            {/* Comments */}
            <div>
              <h6>Comments:</h6>
              {post.comments && post.comments.length > 0 ? (
                post.comments.slice(0, 3).map((comment, index) => (
                  <p key={index} className="text-muted">
                    {comment.text}
                  </p>
                ))
              ) : (
                <p>No comments yet</p>
              )}
            </div>
          </div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts</p>}
    </div>
  );
}
