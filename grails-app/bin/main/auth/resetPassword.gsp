<%--
  Reset Password Page.
  PHP origin: reset-password.html → reset-password.php
--%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Reset Password</title>
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
            <h1>Reset Password</h1>
            <form id="resetPasswordForm">
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
                <button type="submit" class="btn">Reset Password</button>
            </form>
        </div>
    </div>

    <asset:javascript src="application.js"/>
</body>
</html>
