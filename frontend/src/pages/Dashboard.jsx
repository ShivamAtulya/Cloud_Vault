import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  fetchUserAttributes,
  updateUserAttributes,
  signOut,
  fetchAuthSession,
} from "aws-amplify/auth";
import "./Dashboard.css";

// Clean SVG Icons for zero-dependency modern UI
function CloudVaultIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <rect width="6" height="4" x="9" y="13" rx="1" strokeWidth="1.5" />
      <circle cx="12" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FolderIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function FileIcon({ size = 18, type = "" }) {
  let strokeColor = "#64748b";
  if (type.includes("pdf")) strokeColor = "#dc2626";
  else if (type.includes("image")) strokeColor = "#2563eb";
  else if (type.includes("zip") || type.includes("compressed") || type.includes("tar")) strokeColor = "#d97706";
  else if (type.includes("text") || type.includes("json") || type.includes("javascript")) strokeColor = "#059669";

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function UploadIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function DownloadIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function TrashIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function RefreshIcon({ size = 15, spinning = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: spinning ? "cvSpin 0.75s linear infinite" : "none" }}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function PlusIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function LogoutIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function UserIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ArrowLeftIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function DatabaseIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState("");
  const [deletingFileId, setDeletingFileId] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [foldersError, setFoldersError] = useState("");

  const [selectedFolder, setSelectedFolder] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Get Cognito ID token
  async function getIdToken() {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    return token;
  }

  // Load user profile
  async function loadUser() {
    const currentUser = await getCurrentUser();
    const attributes = await fetchUserAttributes();

    const profile = {
      name: attributes.name || currentUser.username,
      email: attributes.email || currentUser.username,
    };

    setUser(profile);
    setNewName(profile.name);
  }

  // Load files from DynamoDB through Lambda
  async function loadFiles(folderId = null) {
    try {
      setFilesLoading(true);
      setFilesError("");

      const token = await getIdToken();

      const filesUrl = folderId
        ? `${apiUrl}/files?folderId=${encodeURIComponent(folderId)}`
        : `${apiUrl}/files`;

      const result = await fetch(filesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Unable to retrieve files.");
      }

      setFiles(data.files || []);

    } catch (error) {
      console.error("File listing error:", error);
      setFilesError(error.message || "Unable to load files.");
    } finally {
      setFilesLoading(false);
    }
  }

  // Load folders
  const loadFolders = async () => {
    try {
      setFoldersLoading(true);
      setFoldersError("");

      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();

      const result = await fetch(`${apiUrl}/folders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Failed to load folders");
      }

      setFolders(data.folders || []);

    } catch (error) {
      console.error("Load folders error:", error);
      setFoldersError(error.message);
    } finally {
      setFoldersLoading(false);
    }
  };

  // Initialize dashboard
  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        await loadUser();

        if (active) {
          await Promise.all([
            loadFiles(),
            loadFolders()
          ]);
        }
      } catch (error) {
        console.error("Dashboard authentication error:", error);

        if (active) {
          navigate("/login", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Update profile
  const handleProfileUpdate = async (event) => {
    event.preventDefault();

    if (!newName.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      await updateUserAttributes({
        userAttributes: {
          name: newName.trim(),
        },
      });

      await loadUser();

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage(error.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Upload file to S3 and save metadata in DynamoDB
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMessage("File size must not exceed 10 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const token = await getIdToken();

      // Step 1: Request presigned S3 URL
      const urlResponse = await fetch(`${apiUrl}/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          fileSize: file.size,
          folderId: selectedFolder?.folderId || null,
        }),
      });

      const urlData = await urlResponse.json();

      if (!urlResponse.ok) {
        throw new Error(urlData.message || "Unable to generate upload URL.");
      }

      // Step 2: Upload actual file to S3
      const s3Response = await fetch(urlData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!s3Response.ok) {
        throw new Error("S3 file upload failed.");
      }

      // Step 3: Save metadata in DynamoDB
      const completeResponse = await fetch(`${apiUrl}/complete-upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileId: urlData.fileId,
          fileName: file.name,
          folderId: selectedFolder?.folderId || null,
        }),
      });

      const completeData = await completeResponse.json();

      if (!completeResponse.ok) {
        throw new Error(
          completeData.message || "Unable to save file metadata."
        );
      }

      setMessage("File uploaded successfully to CloudVault!");

      // Step 4: Refresh file list
      await loadFiles(selectedFolder?.folderId);

    } catch (error) {
      console.error("File upload error:", error);
      setMessage(error.message || "File upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Download file from S3
  const handleFileDownload = async (fileId) => {
    try {
      setMessage("");

      const token = await getIdToken();

      const result = await fetch(
        `${apiUrl}/files/${fileId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Download request failed.");
      }

      if (!data.downloadUrl) {
        throw new Error("Download URL was not returned by the API.");
      }

      // Open the temporary S3 download URL
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = data.fileName || "download";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage("File download started successfully.");

    } catch (error) {
      console.error("Download API error:", error);
      setMessage(error.message || "Unable to download file.");
    }
  };

  // Delete file from S3 and DynamoDB
  const handleDeleteFile = async (fileId, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingFileId(fileId);
      setMessage("");

      const token = await getIdToken();

      const result = await fetch(`${apiUrl}/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Unable to delete file.");
      }

      setMessage("File deleted successfully!");

      // Refresh file list after deletion
      await loadFiles(selectedFolder?.folderId);

    } catch (error) {
      console.error("File deletion error:", error);
      setMessage(error.message || "Unable to delete file.");
    } finally {
      setDeletingFileId(null);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    const folderName = window.prompt("Enter folder name:");

    if (!folderName || !folderName.trim()) {
      return;
    }

    try {
      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();

      const result = await fetch(`${apiUrl}/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          folderName: folderName.trim()
        })
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Folder creation failed");
      }

      setMessage("Folder created successfully!");
      await loadFolders();

    } catch (error) {
      console.error("Create folder error:", error);
      alert(error.message);
    }
  };

  // Open folder
  const handleOpenFolder = async (folder) => {
    setSelectedFolder(folder);
    await loadFiles(folder.folderId);
  };

  // Format file size accurately without inventing numbers
  const formatFileSize = (bytes) => {
    const num = Number(bytes);
    if (!bytes || isNaN(num) || num <= 0) return "0 B";

    if (num < 1024) return `${num} B`;

    if (num < 1024 * 1024) {
      return `${(num / 1024).toFixed(2)} KB`;
    }

    if (num < 1024 * 1024 * 1024) {
      return `${(num / (1024 * 1024)).toFixed(2)} MB`;
    }

    return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <div className="cv-dashboard">
        <div className="cv-loading-container" style={{ minHeight: "80vh" }}>
          <div className="cv-spinner" />
          <p>Loading CloudVault dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Real calculations directly from loaded data (No invented values)
  const totalFiles = files.length;
  const totalFolders = folders.length;
  const storageUsedBytes = files.reduce(
    (acc, file) => acc + (Number(file.fileSize) || 0),
    0
  );
  const formattedStorage = formatFileSize(storageUsedBytes);

  return (
    <div className="cv-dashboard">
      {/* 2. Header */}
      <header className="cv-header">
        <div className="cv-header-inner">
          <div className="cv-brand">
            <div className="cv-brand-icon">
              <CloudVaultIcon size={22} />
            </div>
            <div className="cv-brand-name">
              CloudVault
              <span className="cv-brand-tag">Cloud</span>
            </div>
          </div>

          <div className="cv-user-area">
            <div className="cv-user-profile">
              <div className="cv-avatar" title={user.name}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="cv-user-info">
                <span className="cv-user-name">{user.name}</span>
                <span className="cv-user-email">{user.email}</span>
              </div>
            </div>

            <button
              className="cv-btn cv-btn-secondary cv-btn-sm"
              onClick={() => {
                setEditing(!editing);
                setNewName(user.name);
                setMessage("");
              }}
            >
              <UserIcon size={14} />
              {editing ? "Cancel Edit" : "Edit Profile"}
            </button>

            <button
              className="cv-btn cv-btn-danger cv-btn-sm"
              onClick={handleLogout}
              title="Sign out of CloudVault"
            >
              <LogoutIcon size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="cv-main">
        {/* 3. Main Dashboard: Welcome Message & Prominent Upload Button */}
        <div className="cv-welcome-bar">
          <div className="cv-welcome-content">
            <h1>Welcome back, {user.name}</h1>
            <p>Manage, organize and access your cloud documents securely.</p>
          </div>

          <div>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            {/* Prominent Upload Button */}
            <button
              className="cv-btn-upload-prominent"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <UploadIcon size={18} />
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>

        {/* Global Alert / Message Notification */}
        {message && (
          <div className="cv-alert cv-alert-info">
            <div className="cv-alert-content">
              <span>ℹ️</span>
              <span>{message}</span>
            </div>
            <button
              className="cv-alert-close"
              onClick={() => setMessage("")}
              aria-label="Close message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Edit Profile Section (Collapsible) */}
        {editing && (
          <div className="cv-profile-card">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="cv-profile-form">
              <div className="cv-form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  className="cv-form-input"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="cv-form-group">
                <label>Email Address (read-only)</label>
                <input
                  type="email"
                  className="cv-form-input"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="cv-profile-actions">
                <button
                  type="submit"
                  className="cv-btn cv-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="cv-btn cv-btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    setNewName(user.name);
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. Small Summary Cards (Calculated directly from loaded data) */}
        <div className="cv-stats-grid">
          <div className="cv-stat-card">
            <div className="cv-stat-icon files">
              <FileIcon size={22} />
            </div>
            <div className="cv-stat-details">
              <span className="cv-stat-title">Total Files</span>
              <span className="cv-stat-value">{totalFiles}</span>
            </div>
          </div>

          <div className="cv-stat-card">
            <div className="cv-stat-icon folders">
              <FolderIcon size={22} />
            </div>
            <div className="cv-stat-details">
              <span className="cv-stat-title">Total Folders</span>
              <span className="cv-stat-value">{totalFolders}</span>
            </div>
          </div>

          <div className="cv-stat-card">
            <div className="cv-stat-icon storage">
              <DatabaseIcon size={22} />
            </div>
            <div className="cv-stat-details">
              <span className="cv-stat-title">Storage Used</span>
              <span className="cv-stat-value">{formattedStorage}</span>
            </div>
          </div>
        </div>

        {/* 4. My Folders Section (Shown in Root View) */}
        {!selectedFolder && (
          <section className="cv-section-card">
            <div className="cv-section-header">
              <div className="cv-section-title-group">
                <h2 className="cv-section-title">
                  <FolderIcon size={20} color="#2563eb" />
                  My Folders
                </h2>
                <span className="cv-badge-count">{folders.length}</span>
              </div>

              <div className="cv-section-actions">
                <button
                  className="cv-btn cv-btn-primary cv-btn-sm"
                  onClick={handleCreateFolder}
                >
                  <PlusIcon size={14} />
                  Create Folder
                </button>

                <button
                  className="cv-btn cv-btn-secondary cv-btn-sm"
                  onClick={loadFolders}
                  disabled={foldersLoading}
                >
                  <RefreshIcon size={14} spinning={foldersLoading} />
                  {foldersLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="cv-section-body">
              {foldersLoading && (
                <div className="cv-loading-container">
                  <div className="cv-spinner" />
                  <p>Loading folders...</p>
                </div>
              )}

              {foldersError && (
                <div className="cv-alert cv-alert-error">
                  <span>{foldersError}</span>
                </div>
              )}

              {!foldersLoading && !foldersError && folders.length === 0 && (
                <div className="cv-empty-state">
                  <div className="cv-empty-icon">
                    <FolderIcon size={28} />
                  </div>
                  <h3 className="cv-empty-title">No folders created yet</h3>
                  <p className="cv-empty-desc">Create folders to organize your documents and files into tidy groups.</p>
                  <button
                    className="cv-btn cv-btn-secondary cv-btn-sm"
                    onClick={handleCreateFolder}
                    style={{ marginTop: "4px" }}
                  >
                    <PlusIcon size={14} />
                    Create Your First Folder
                  </button>
                </div>
              )}

              {!foldersLoading && folders.length > 0 && (
                <div className="cv-folders-grid">
                  {folders.map((folder) => (
                    <div
                      key={folder.folderId}
                      className="cv-folder-card"
                      onClick={() => handleOpenFolder(folder)}
                      title={`Click to open ${folder.folderName}`}
                    >
                      <div className="cv-folder-icon-wrapper">
                        <FolderIcon size={20} />
                      </div>
                      <div className="cv-folder-info">
                        <span className="cv-folder-name">{folder.folderName}</span>
                        <span className="cv-folder-subtext">Click to view files</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. Folder View Header (When a folder is selected) */}
        {selectedFolder && (
          <div className="cv-folder-view-header">
            <div className="cv-folder-breadcrumb">
              <button
                className="cv-btn cv-btn-secondary"
                onClick={() => {
                  setSelectedFolder(null);
                  loadFiles();
                }}
              >
                <ArrowLeftIcon size={15} />
                Back to My Folders
              </button>

              <div className="cv-folder-active-title">
                <FolderIcon size={20} color="#2563eb" />
                <span>{selectedFolder.folderName}</span>
              </div>
            </div>

            <div className="cv-section-actions">
              <button
                className="cv-btn cv-btn-primary cv-btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <UploadIcon size={14} />
                {uploading ? "Uploading..." : `Upload to ${selectedFolder.folderName}`}
              </button>
            </div>
          </div>
        )}

        {/* 5. My Files Section */}
        <section className="cv-section-card">
          <div className="cv-section-header">
            <div className="cv-section-title-group">
              <h2 className="cv-section-title">
                <FileIcon size={20} />
                {selectedFolder
                  ? `Files in "${selectedFolder.folderName}"`
                  : "My Files"}
              </h2>
              <span className="cv-badge-count">{files.length}</span>
            </div>

            <div className="cv-section-actions">
              <button
                className="cv-btn cv-btn-secondary cv-btn-sm"
                onClick={() => loadFiles(selectedFolder?.folderId)}
                disabled={filesLoading}
              >
                <RefreshIcon size={14} spinning={filesLoading} />
                {filesLoading ? "Refreshing..." : "Refresh Files"}
              </button>
            </div>
          </div>

          <div className="cv-section-body" style={{ padding: files.length > 0 ? 0 : "24px" }}>
            {filesLoading && (
              <div className="cv-loading-container">
                <div className="cv-spinner" />
                <p>Loading your files...</p>
              </div>
            )}

            {filesError && (
              <div className="cv-alert cv-alert-error" style={{ margin: "20px" }}>
                <span>{filesError}</span>
              </div>
            )}

            {!filesLoading && !filesError && files.length === 0 && (
              <div className="cv-empty-state">
                <div className="cv-empty-icon">
                  <FileIcon size={28} />
                </div>
                <h3 className="cv-empty-title">No files found</h3>
                <p className="cv-empty-desc">
                  {selectedFolder
                    ? `This folder "${selectedFolder.folderName}" is currently empty.`
                    : "No files uploaded to your vault yet."}
                </p>
                <button
                  className="cv-btn cv-btn-primary cv-btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{ marginTop: "4px" }}
                >
                  <UploadIcon size={14} />
                  Upload a File Now
                </button>
              </div>
            )}

            {!filesLoading && !filesError && files.length > 0 && (
              <div className="cv-table-wrapper">
                <table className="cv-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>File Size</th>
                      <th>File Type</th>
                      <th>Uploaded At</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {files.map((file) => (
                      <tr key={file.fileId}>
                        <td>
                          <div className="cv-file-name-cell">
                            <div className="cv-file-icon">
                              <FileIcon size={16} type={file.contentType || ""} />
                            </div>
                            <span className="cv-file-title" title={file.fileName}>
                              {file.fileName}
                            </span>
                          </div>
                        </td>

                        <td>{formatFileSize(Number(file.fileSize))}</td>

                        <td>
                          <span className="cv-badge-type" title={file.contentType}>
                            {file.contentType || "file"}
                          </span>
                        </td>

                        <td>
                          {file.uploadedAt
                            ? new Date(file.uploadedAt).toLocaleString()
                            : "Unknown"}
                        </td>

                        <td>
                          <div
                            className="cv-actions-group"
                            style={{ justifyContent: "flex-end" }}
                          >
                            <button
                              className="cv-btn cv-btn-secondary cv-btn-sm"
                              onClick={() => handleFileDownload(file.fileId)}
                              title="Download file"
                            >
                              <DownloadIcon size={13} />
                              Download
                            </button>

                            <button
                              className="cv-btn cv-btn-danger cv-btn-sm"
                              onClick={() =>
                                handleDeleteFile(file.fileId, file.fileName)
                              }
                              disabled={deletingFileId !== null}
                              title="Delete file"
                            >
                              <TrashIcon size={13} />
                              {deletingFileId === file.fileId
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;