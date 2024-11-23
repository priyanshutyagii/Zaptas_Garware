import { useEffect, useState } from "react";
import { FaLinkedin, FaThumbsUp } from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import showToast from "../../utils/toastHelper";

export default function LinkedInCard() {
  const [posts, setPosts] = useState([]);
  const [loggin, setLoggin] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([
    "Great announcement!",
    "Looking forward to this.",
    "Congratulations!",
  ]);
  const [newComment, setNewComment] = useState("");

  const fetchPosts = async () => {
    try {
      const url = `${ConnectMe.BASE_URL}/fetchOrgPosts?start=0&count=3&show=posts,multimedia,likeStatus,text,likeCount,id`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success) {
        setPosts(response?.data?.posts);
      } else {
        if (!response.success && response.errorMessage === "loginRequired") {
          setLoggin(true);
          showToast("You need to log in first", "success");
          return;
        }
        showToast("Failed to load posts", "error");
      }
    } catch (error) {
      showToast("Failed to load posts", "error");
      console.error("Error fetching posts:", error.message);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLikeToggle = async (postId, method) => {
    try {
      const token = getTokenFromLocalStorage();
      const url = `${ConnectMe.BASE_URL}/${method}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({ postId });

      await apiCall("POST", url, headers, body);
      fetchPosts();
    } catch (error) {
      console.error("Error liking/unliking post:", error.message);
    }
  };

  const openPostPopup = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const closePostPopup = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaLinkedin className="me-2" />
          <h5 className="mb-0">LinkedIn</h5>
        </div>
        <a href="/view-all" className="text-decoration-none">
          View All <HiArrowCircleRight />
        </a>
      </div>
      {loggin ? (
        <button>Login with LinkedIn</button>
      ) : (
        <div className="card-body">
          {posts.map((post) => (
            <div key={post.id} className="row mb-3">
              <div className="csr-media col-sm-4 text-center">
                {post.multimedia.type === "image" ? (
                  <img
                    src={post.multimedia.url}
                    alt="LinkedIn Post"
                    style={{ width: "100%", height: "100px" }}
                  />
                ) : post.multimedia.type === "video" ? (
                  <video width="100%" height="100" controls autoPlay muted loop>
                    <source src={post.multimedia.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
              <div className="announcement-disc col-sm-8">
                <p className="card-text fs-6">{post.text.slice(0, 50)}...</p>
                <p className="card-text fs-6">
                  <FaThumbsUp
                    style={{
                      color: post?.fetchUserLikesStatus ? "blue" : "gray",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleLikeToggle(
                        post.id,
                        post?.fetchUserLikesStatus ? "disslike" : "likePost"
                      )
                    }
                  />
                  {post?.likeCount?.totalLikes}
                </p>
                <a
                  href="#"
                  onClick={() => openPostPopup(post)}
                  className="text-decoration-none"
                >
                  Read More +
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for LinkedIn Post */}
      <Modal show={showModal} onHide={closePostPopup} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPost?.text}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>{selectedPost?.text}</p>
            <FaThumbsUp
              style={{
                color: selectedPost?.fetchUserLikesStatus ? "blue" : "gray",
                cursor: "pointer",
              }}
              onClick={() =>
                handleLikeToggle(
                  selectedPost.id,
                  selectedPost?.fetchUserLikesStatus ? "disslike" : "likePost"
                )
              }
            />
            {selectedPost?.likeCount?.totalLikes} Likes
          </div>
          <div className="comments-section mt-3">
            <h5>Comments</h5>
            <ul>
              {comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="form-control mb-2"
            />
            <Button variant="primary" onClick={addComment}>
              Post Comment
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
