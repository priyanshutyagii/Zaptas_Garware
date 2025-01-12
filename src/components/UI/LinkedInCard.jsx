import { useEffect, useState, useMemo, useRef } from "react";
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
import { Carousel } from "react-bootstrap"; // Import Carousel
import "./LinkedInCard.css";
import PostCard from "./postDisplay";
import { useNavigate } from "react-router-dom";

export default function LinkedInCard() {
  const [loadingPostIds, setLoadingPostIds] = useState([]); // Track which posts are being liked/unliked
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
  const currentRequest = useRef(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true); // Show loader
    try {
      const url = `${ConnectMe.BASE_URL}/fetchOrgPosts?start=0&count=5&show=posts,multimedia,likeStatus,text,likeCount,id`;
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

  const handleLikeToggle = async (postId, method, name = null) => {
    try {
      setLoadingPostIds((prevIds) => [...prevIds, postId]); // Add post ID to loading state

      // Cancel the previous request if it's ongoing
      if (currentRequest.current) {
        currentRequest.current.abort();
      }

      // Create a new AbortController for each request
      const controller = new AbortController();
      const signal = controller.signal;

      // Store the controller in the ref to cancel it on future requests
      currentRequest.current = controller;

      // Update the like status locally before making the API call

      if (name == "modelBox") {
        setSelectedPost((prevPost) => {
          if (!prevPost) return prevPost; // Ensure prevPost exists

          // Update the single post object
          return {
            ...prevPost,
            fetchUserLikesStatus: method === "likepost" ? true : false,
            likeCount: {
              totalLikes:
                method === "likepost"
                  ? prevPost.likeCount.totalLikes + 1
                  : method === "disslike"
                  ? prevPost.likeCount.totalLikes - 1
                  : prevPost.likeCount.totalLikes,
            },
          };
        });
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  fetchUserLikesStatus: method === "likepost" ? true : false,
                  likeCount: {
                    totalLikes:
                      method === "likepost"
                        ? post.likeCount.totalLikes + 1
                        : method === "disslike"
                        ? post.likeCount.totalLikes - 1
                        : post.likeCount.totalLikes,
                  },
                }
              : post
          )
        );
      }

      const token = getTokenFromLocalStorage();
      const url = `${ConnectMe.BASE_URL}/${method}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const body = JSON.stringify({ postId });

      // Make the API call with the AbortController signal
      await apiCall("POST", url, headers, body, { signal });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Previous request was cancelled.");
      } else {
        console.error("Error liking/unliking post:", error.message);
      }
    } finally {
      setLoadingPostIds((prevIds) => prevIds.filter((id) => id !== postId)); // Remove post ID from loading state
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

  const memoizedPosts = useMemo(() => posts, [posts]);

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <FaLinkedin className="me-2" />
          <h5 className="mb-0">LinkedIn</h5>
        </div>
        <a
          onClick={() => {
            navigate("/view-all");
          }}
          className="text-decoration-none"
        >
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
        <div className="card-body card-scroll">
          {/* Carousel for Posts */}
          <Carousel>
            {memoizedPosts.map((post) => (
              <Carousel.Item key={post.id} className="linkekItem">
                <div className="row mb-3" onClick={() => openPostPopup(post)}>
                  <div
                    className="csr-media col-sm-12 text-center"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 0, // Remove padding
                      margin: 0, // Remove margin
                      height: "250px", // Fixed height
                      overflow: "hidden", // Crop any extra space
                    }}
                  >
                    {post.multimedia.type === "image" ? (
                      <img
                        src={post.multimedia.url}
                        alt="LinkedIn Post"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Ensures the image fills the container
                        }}
                      />
                    ) : post.multimedia.type === "video" ? (
                      <video
                        controls
                        autoPlay
                        muted
                        loop
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Ensures the video fills the container
                          margin: 0, // Ensure no white space
                          padding: 0, // Ensure no white space
                        }}
                      >
                        <source src={post.multimedia.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>

                  <div className="announcement-disc col-sm-12 mt-2">
                    <div className="card-text fs-6">
                      <PostCard post={post.text} size={180} />
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <p className="card-like fs-6">
                        <FaThumbsUp
                          className={`like-icon ${
                            loadingPostIds.includes(post.id) ? "loading" : ""
                          }`}
                          style={{
                            color: post?.fetchUserLikesStatus ? "blue" : "gray",
                            cursor: "pointer",
                          }}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent the modal from opening
                            handleLikeToggle(
                              post.id,
                              post?.fetchUserLikesStatus
                                ? "disslike"
                                : "likepost"
                            );
                          }}
                        />
                        {post?.likeCount?.totalLikes}
                      </p>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      {/* Modal for LinkedIn Post */}
      <Modal show={showModal} onHide={closePostPopup} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <PostCard post={selectedPost?.text} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {selectedPost?.multimedia?.type === "image" ? (
              <img
                src={selectedPost.multimedia.url}
                alt="LinkedIn selectedPost"
                style={{ width: "100%", height: "auto" }}
              />
            ) : selectedPost?.multimedia?.type === "video" ? (
              <video
                controls
                autoPlay
                muted
                loop
                style={{
                  width: "100%",
                  height: "60%",
                  objectFit: "cover", // Ensures the video covers the space without distortion
                }}
              >
                <source src={selectedPost.multimedia.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>

          <div className="likencmt">
            <div>
              <FaThumbsUp
                className={`like-icon  ${
                  loadingPostIds.includes(selectedPost?.id) ? "loading" : ""
                }`}
                style={{
                  color: selectedPost?.fetchUserLikesStatus ? "blue" : "gray",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleLikeToggle(
                    selectedPost.id,
                    selectedPost?.fetchUserLikesStatus
                      ? "disslike"
                      : "likepost",
                    "modelBox"
                  )
                }
              />
              &nbsp;
              {selectedPost?.likeCount?.totalLikes} Likes
            </div>
            {/* <div
              onClick={() => setShowComments(!showComments)}
              style={{ cursor: "pointer" }}
            >
              <FaRegCommentDots /> 1 comment
            </div> */}
          </div>

          {/* {showComments && (
            <div>
              {comments.map((comment, index) => (
                <div key={index}>
                  <p>{comment}</p>
                </div>
              ))}
            </div>
          )} */}
        </Modal.Body>
        {/* <Modal.Footer>
          <div className="add-comment-box">
            <input
              type="text"
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <FaPaperPlane onClick={addComment} />
          </div>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}
