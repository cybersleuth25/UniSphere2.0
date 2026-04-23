<%--
  Main Dashboard Page.
  PHP origin: index.html
  
  This is the main entry point of the application.
  Renders the tabbed dashboard with posts, sidebar, and modals.
--%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>UniSphere</title>
    <%-- Google Fonts: Midnight Ethereal Editorial --%>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Karla:wght@400;500;700&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <asset:stylesheet src="style.css"/>
</head>
<body>

    <%-- Ethereal Background Effects --%>
    <div class="noise-overlay"></div>
    <div class="ethereal-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>

    <header class="header stagger-1">
        <div class="brand">
            <div><asset:image src="Logo.jpg" alt="UniSphere Logo" class="logo"/></div>
            <div class="title">
                <h1>UniSphere</h1>
                <p>Stay Updated. Stay Connected.</p>
            </div>
        </div>
        <div class="controls">
            <div class="search" title="Search posts and users">
                <i class="fas fa-search"></i>
                <input id="searchInput" placeholder="Search..."/>
            </div>
            <div class="notification-icon" id="notificationIcon">
                <i class="fas fa-bell"></i>
                <span class="notification-count" style="display: none;">0</span>
            </div>
            <div class="theme-switch-wrapper">
                <label class="theme-switch" for="checkbox">
                    <input type="checkbox" id="checkbox"/>
                    <div class="slider round"></div>
                </label>
            </div>
            <div id="auth-buttons" class="auth-buttons-wrapper"></div>
            <button class="btn" id="addPostBtn" style="display:none">+ Post</button>
        </div>
    </header>

    <div class="main-content">
        <h1 id="welcomeMessage" class="main-heading stagger-2"></h1>

        <main class="main">
            <section>
                <nav class="tabs stagger-2" role="tablist" aria-label="Main tabs">
                    <div class="tab active" data-tab="announcements">Announcements</div>
                    <div class="tab" data-tab="events">Events</div>
                    <div class="tab" data-tab="lostfound">Lost &amp; Found</div>
                    <div class="tab" data-tab="resources">Resource</div>
                    <div class="tab" data-tab="groups">Community Connect</div>
                    <div class="tab" data-tab="courses">Courses</div>
                </nav>
                <div id="contentArea" class="stagger-3"></div>
            </section>
            <aside class="sidebar stagger-4">
                <h3 style="margin-top:0">Quick Actions</h3>
                <p class="small">Easily create a new post by selecting a category.</p>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <button class="btn secondary admin-only-post" data-post-type="announcements">Add Announcement</button>
                    <button class="btn secondary admin-only-post" data-post-type="events">Add Event</button>
                    <button class="btn secondary student-post" data-post-type="lostfound">Add Lost/Found</button>
                    <button class="btn secondary student-post" data-post-type="resources">Add Resource</button>
                    <button class="btn secondary student-post" data-post-type="groups">Create Group</button>
                    <button class="btn secondary student-post" data-post-type="courses">Add Course</button>
                </div>
                <hr style="margin:16px 0; border:none; border-top:1px solid var(--muted-elements)">
                <h4 style="margin:6px 0">About UniSphere</h4>
                <p class="small">A student-centric hub for announcements, events, resource sharing, and more.</p>
            </aside>
        </main>
    </div>

    <%-- Footer --%>
    <g:render template="/common/footer"/>

    <%-- Create/Edit Post Modal --%>
    <div id="postModal" class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Create New Post</h2>
            <form id="postForm" enctype="multipart/form-data">
                <input type="hidden" id="postType" name="postType">
                <input type="hidden" id="postId" name="postId">
                <div class="form-group">
                    <label for="postTitle">Title</label>
                    <input type="text" id="postTitle" name="title" required>
                </div>
                <div class="form-group">
                    <label for="postDesc">Description</label>
                    <textarea id="postDesc" name="description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="postImage">Image (Optional)</label>
                    <input type="file" id="postImage" name="image" accept="image/*">
                </div>
                <button type="submit" class="btn">Submit Post</button>
            </form>
        </div>
    </div>

    <%-- Image Preview Modal --%>
    <div id="imagePreviewModal" class="modal">
        <div class="modal-content" style="background: none; border: none; box-shadow: none; max-width: min(70vw, 800px); max-height: 80vh;">
            <span class="close-btn" style="color: white; font-size: 36px; text-shadow: 1px 1px 3px black;">&times;</span>
            <img id="fullSizeImage" src="" alt="Full-size preview" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
    </div>

    <%-- Notifications Panel --%>
    <div class="notification-panel" id="notificationPanel">
        <h3>Notifications</h3>
        <div class="notification-list" id="notificationList"></div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.0.2/marked.min.js"></script>
    <asset:javascript src="application.js"/>
</body>
</html>
