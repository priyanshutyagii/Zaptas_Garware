import React from "react";
import "./Announcements.css";

export default function Announcements() {
  return (
    <div classNameName="admin-announcements">
      <h2>Announcements</h2>

      <div className="old-announcements">
        <h4>Old Announcements</h4>
        <ul>
          <li>Announcement 1</li>
          <li>Announcement 2</li>
          <li>Announcement 3</li>
        </ul>
        <div className="announcement-actions">
          <button className="view-btn">View</button>
          <button className="update-btn">Update</button>
          <button className="delete-btn">Delete</button>
          <button className="activate-btn">Activate</button>
          <button className="deactivate-btn">Deactivate</button>
          <button className="like-btn">Like</button>
        </div>
      </div>

      <hr></hr>
      {/* New Announcements Section */}
      <div className="new-announcements">
        <h4>New Announcement</h4>
        <form>
          <div className="form-group">
            <label for="title">Announcement Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter announcement title"
            />
          </div>

          <div className="form-group">
            <label for="manager">Assistant Manager</label>
            <input
              type="text"
              id="manager"
              placeholder="Assistant Manager - Accounts"
            />
          </div>

          <div className="form-group">
            <label for="location">Based At</label>
            <input
              type="text"
              id="location"
              placeholder="Chhatrapati Sambhajinagar (Maharashtra)"
            />
          </div>

          <div className="form-group">
            <label for="reporting">Reporting To</label>
            <input
              type="text"
              id="reporting"
              placeholder="Mr. Amit Dargad (Senior General Manager, Accounts)"
            />
          </div>

          <div className="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter description"
            ></textarea>
          </div>

          <div className="form-group">
            <label for="profile-image">Profile Image</label>
            <input type="file" id="profile-image" />
          </div>

          <div className="form-group">
            <label>Upload Images</label>
            <input type="file" />
            <input type="file" />
            <input type="file" />
          </div>

          <div className="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              placeholder="Enter welcome message"
            ></textarea>
          </div>

          <div className="form-group">
            <label for="team">Team</label>
            <input type="text" id="team" placeholder="GHFL HR TEAM" />
          </div>

          <div className="form-group">
            <label for="date">Date</label>
            <input type="date" id="date" />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="reset" className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
