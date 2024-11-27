import { useEffect, useState, useMemo } from "react";
import {
  FaLinkedin,
  FaPaperPlane,
  FaRegCommentDots,
  FaThumbsUp,
} from "react-icons/fa";
import { HiArrowCircleRight } from "react-icons/hi";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ClipLoader from "react-spinners/ClipLoader"; // Loader library
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import ConnectMe from "../../config/connect";
import showToast from "../../utils/toastHelper";
import "./LinkedInCard.css";

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
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const fetchPosts = async () => {
    setLoading(true); // Show loader
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
    } finally {
      setLoading(false); // Hide loader
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
      setComments((prevComments) => [...prevComments, newComment]);
      setNewComment("");
    }
  };

  const formatText = (text) => {
    if (!text) return null;

    // Replace `{hashtag|#|tag}` with `#tag` and style it in blue
    return text
      .replace(/{hashtag\|\\#\|/g, '#') // Replace starting hashtag syntax
      .replace(/}/g, '') // Remove closing syntax
      .replace(/#(\w+)/g, '<span style="color:blue;">#$1</span>') // Make hashtags blue
      .replace(/(\r\n|\n|\r)/gm, '<br>'); // Replace line breaks with HTML <br> tags for proper rendering
  };

  

  const memoizedPosts = useMemo(() => posts, [posts]);

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

      {loading ? (
        <div className="text-center my-4">
          <ClipLoader color="#0073b1" size={50} />
        </div>
      ) : loggin ? (
        <button onClick={handleLinkedInCallback}>Login with LinkedIn</button>
      ) : (
        <div className="card-body">
          {memoizedPosts.map((post) => (
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
                <p
                  className="card-text fs-6"
                  dangerouslySetInnerHTML={{
                    __html: `${formatText(post.text.slice(0, 50))}...`,
                  }}
                ></p>
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
                  />{" "}
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
      <Modal show={showModal} onHide={closePostPopup}>
        <Modal.Header closeButton>
        <Modal.Title>
            <div dangerouslySetInnerHTML={{ __html: formatText(selectedPost?.text) }} />
          </Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <div>
            {selectedPost?.multimedia?.type === "image" ? (
              <img
                src={selectedPost.multimedia.url}
                alt="LinkedIn selectedPost"
              />
            ) : selectedPost?.multimedia?.type === "video" ? (
              <video controls autoPlay muted loop>
                <source src={selectedPost.multimedia.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
          <div className="likencmt">
            <div>
              <FaThumbsUp
                style={{
                  color: selectedPost?.fetchUserLikesStatus ? "blue" : "gray",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleLikeToggle(
                    selectedPost.id,
                    selectedPost?.fetchUserLikesStatus
                      ? "disslike"
                      : "likePost"
                  )
                }
              />
              &nbsp;
              {selectedPost?.likeCount?.totalLikes} Likes
            </div>
            <div
              onClick={() => setShowComments(!showComments)}
              style={{ cursor: "pointer" }}
            >
              <FaRegCommentDots /> 1 comment
            </div>
          </div>

          {showComments && (
            <div>
              {comments.map((comment, index) => (
                <div key={index}>
                  <p>{comment}</p>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="add-comment-box">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <FaPaperPlane onClick={addComment} />
          </div>
          <Button variant="secondary" onClick={closePostPopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
