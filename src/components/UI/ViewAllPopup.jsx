import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ViewAllPopup.css";
import ConnectMe from "../../config/connect";
import { apiCall, getTokenFromLocalStorage } from "../../utils/apiCall";
import showToast from "../../utils/toastHelper";
import PostCard from "./postDisplay";
import Loader from "../Loader";

export default function ViewAllPage() {
  const { state } = useLocation();
  const { title, type = "announcement" } = state;

  const [posts, setPosts] = useState([]); // All fetched posts
  const [loading, setLoading] = useState(false); // Loading state
  const startRef = useRef(1); // Ref for pagination
  const hasMore = useRef(true); // Ref to track if there are more posts

  const fetchAnnouncements = async (limit = 9) => {
    if (!hasMore.current || loading) return; // Exit if no more posts or already loading

    try {
      setLoading(true);
      const url = `${ConnectMe.BASE_URL}/${type}/latest?page=${startRef.current}&limit=${limit}`;
      const token = getTokenFromLocalStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await apiCall("GET", url, headers);

      if (response.success && response.data.announcements.length > 0) {
        setPosts((prev) => [...prev, ...response.data.announcements]); // Append new posts
        startRef.current += 1; // Increment the page for the next fetch
      } else {
        hasMore.current = false; // No more posts available
        if (response.data.announcements.length === 0) {
          showToast("No more posts available", "info");
        }
      }
    } catch (error) {
      hasMore.current = false; // Stop further API calls on error
      showToast("Error loading posts", "error");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Debounce Function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    // Create a debounced version of the fetchAnnouncements function
    const debouncedFetch = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        fetchAnnouncements(); // Fetch posts when scrolling to the bottom
      }
    }, 300); // Debounce delay of 300ms

    window.addEventListener("scroll", debouncedFetch);
    return () => window.removeEventListener("scroll", debouncedFetch); // Cleanup on unmount
  }, [fetchAnnouncements]); // Dependency to ensure the function is re-created if fetchAnnouncements changes

  // Initial fetch when the page loads
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="view-all-page">
      <header className="page-header">
        {/* <h1>{title}</h1> */}
      </header>

      {posts.length === 0 && !loading && <p>No posts available</p>}
      {posts.length > 0 && (
        <div className="row">
          {posts.map((post) => (
            <React.Fragment key={post._id}>
              <div className="col-md-6">
                <div className="content-box">
                  <h5>{post.title}</h5>
                  <div className="card-text fs-6">
                    <PostCard post={post.description} size={70} />
                  </div>
                  <div className="additional-info mt-1">
                    {post.links[0]?.link && (
                      <a
                        href={post.links[0]?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link: {post.links[0]?.link}
                      </a>
                    )}
                    <br />
                    <span>Location: {post.location}</span> &nbsp;
                    <span>
                      Date:{" "}
                      {new Date(post.AnnouncementDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

             {/* Bootstrap Carousel for Image Slider (4 photos per slide) */}
             {post.imagePath?.length > 0 && (
                <div className="col-md-6">
                  <div
                    id={`carousel-${post._id}`}
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                      {post.imagePath
                        .reduce((acc, img, index) => {
                          if (index % 4 === 0) acc.push([]); // Create a new slide every 4 images
                          acc[acc.length - 1].push(img); // Push the image to the current slide
                          return acc;
                        }, [])
                        .map((slide, index) => (
                          <div
                            key={index}
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                          >
                            <div className="row">
                              {slide.map((image, imgIndex) => (
                                <div key={imgIndex} className="col-md-3">
                                  <img
                                    src={`${ConnectMe.img_URL}${image}`}
                                    alt={`slide-${imgIndex}`}
                                    className="d-block w-100 slider-image"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    {/* Carousel Controls */}
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carousel-${post._id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carousel-${post._id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {loading && <Loader />} {/* Show loader when fetching data */}
    </div>
  );
}
