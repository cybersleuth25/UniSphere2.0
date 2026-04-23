<%--
  Login Page.
  PHP origin: login.html → login.php
  
  Form submits to /auth/doLogin via AJAX (same pattern as PHP version).
--%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>UniSphere Login</title>
    <asset:stylesheet src="style.css"/>
    <%-- Google Fonts: Midnight Ethereal Editorial --%>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Karla:wght@400;500;700&display=swap">
</head>
<body class="auth-page-body">

    <%-- Ethereal Background Effects --%>
    <div class="noise-overlay"></div>
    <div class="ethereal-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>

    <div class="login-container">
        <div class="login-card stagger-1">
            <h1>Login</h1>
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Email</label>
                    <input type="email" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
            <p class="small-text" style="margin-top: 16px; font-weight:600;">Don't have an account? <g:link controller="auth" action="signup">Sign Up</g:link></p>
            <p class="small-text" style="font-weight:600;"><g:link controller="auth" action="forgotPassword">Forgot Password?</g:link></p>
        </div>
    </div>

    <asset:javascript src="application.js"/>
</body>
</html>
