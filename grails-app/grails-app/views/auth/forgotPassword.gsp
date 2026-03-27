<%--
  Forgot Password Page.
  PHP origin: forgot-password.html → forgot-password.php
--%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Forgot Password</title>
    <asset:stylesheet src="style.css"/>
</head>
<body class="login-page">
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
