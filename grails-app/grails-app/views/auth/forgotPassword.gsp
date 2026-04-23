<%--
  Forgot Password Page.
  PHP origin: forgot-password.html → forgot-password.php
--%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Forgot Password</title>
    <%-- Google Fonts: Midnight Ethereal Editorial --%>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Karla:wght@400;500;700&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <asset:stylesheet src="style.css"/>
</head>
<body class="login-page">

    <%-- Ethereal Background Effects --%>
    <div class="noise-overlay"></div>
    <div class="ethereal-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>
    <div class="login-container">
        <div class="login-card">
            <h1>Forgot Password</h1>
            <p class="small-text" style="color: var(--text-muted); margin-bottom: 20px;">Enter your email address to reset your password.</p>
            <form id="forgotPasswordForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <button type="submit" class="btn">Send Reset Link</button>
            </form>
            <p class="small-text"><g:link controller="auth" action="login">Back to Login</g:link></p>
        </div>
    </div>
    <asset:javascript src="application.js"/>
</body>
</html>
