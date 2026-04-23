<%--
  Profile Page.
  PHP origin: profile.php
  
  Variables available from ProfileController.show():
    - user (Map): user data
    - isOwnProfile (boolean): whether this is the logged-in user's own profile
    - userJson (String): JSON representation of user for JavaScript
    - isOwnProfileJson (String): JSON boolean for JavaScript
--%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${user.username}'s Profile</title>
    <asset:stylesheet src="style.css"/>
    <%-- Google Fonts: Midnight Ethereal Editorial --%>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Karla:wght@400;500;700&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="profile-page-body">

    <%-- Ethereal Background Effects --%>
    <div class="noise-overlay"></div>
    <div class="ethereal-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>

    <div class="profile-container stagger-1">
        <div class="profile-avatar-wrapper">
            <img src="" alt="Profile Avatar" id="profileAvatarImg" class="profile-avatar">
            <g:if test="${isOwnProfile}">
                <input type="file" id="avatarUploadInput" style="display: none;" accept="image/png, image/jpeg, image/gif">
                <button id="uploadAvatarBtn" class="avatar-control-btn" title="Upload a new avatar">
                    <i class="fas fa-upload"></i>
                </button>
                <button id="changeAvatarBtn" class="avatar-control-btn" title="Get a new generated avatar">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </g:if>
        </div>

        <h1 id="welcomeHeading">${user.username}</h1>
        <p id="emailSubheading" class="subheading">${user.email}</p>

        <div class="profile-details subheading" style="margin-top: -20px; margin-bottom: 20px;">
            <span>${user.branch}</span>
            &bull;
            <span>Semester ${user.semester}</span>
        </div>

        <g:if test="${isOwnProfile}">
            <div class="profile-page-actions">
                <button id="editProfileBtn" class="btn secondary">Edit Profile</button>
                <g:link controller="main" action="index" class="btn secondary">Main Page</g:link>
                <g:link controller="auth" action="logout" class="btn secondary">Logout</g:link>
            </div>
        </g:if>
        <g:else>
            <div class="profile-page-actions">
                <g:link controller="main" action="index" class="btn secondary">Main Page</g:link>
            </div>
        </g:else>
    </div>

    <%-- Edit Profile Modal --%>
    <div id="editProfileModal" class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Edit Profile</h2>
            <form id="editProfileForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="bio">Bio</label>
                    <textarea id="bio" name="bio" rows="4" placeholder="Tell us a little about yourself..."></textarea>
                </div>
                <button type="submit" class="btn">Update Profile</button>
            </form>
        </div>
    </div>

    <%-- Pass server data to JavaScript (same pattern as PHP's serverData) --%>
    <script>
        const serverData = {
            user: ${raw(userJson)},
            isOwnProfile: ${isOwnProfileJson}
        };
    </script>

    <asset:javascript src="application.js"/>
</body>
</html>
