<%--
  Signup Page.
  PHP origin: signup.html → signup.php
  
  Form submits to /auth/doSignup via AJAX.
--%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>UniSphere Sign Up</title>
    <asset:stylesheet src="style.css"/>
</head>
<body class="auth-page-body">

    <div class="login-container">
        <div class="login-card stagger-1">
            <h1>Sign Up</h1>
            <form id="signupForm">
                <div class="form-group">
                    <label for="newUsername">Username</label>
                    <input type="text" id="newUsername" name="newUsername" required>
                </div>
                <div class="form-group">
                    <label for="newEmail">Email</label>
                    <input type="email" id="newEmail" name="newEmail" required>
                </div>
                <div class="form-group">
                    <label for="branch">Branch</label>
                    <select id="branch" name="branch" required>
                        <option value="">Select your branch</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Science">Information Science</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="semester">Semester</label>
                    <input type="number" id="semester" name="semester" min="1" max="8" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">Password</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                </div>
                <button type="submit" class="btn">Sign Up</button>
            </form>
            <p class="small-text" style="margin-top: 16px; font-weight:600;">Already have an account? <g:link controller="auth" action="login">Login</g:link></p>
        </div>
    </div>

    <asset:javascript src="application.js"/>
</body>
</html>
