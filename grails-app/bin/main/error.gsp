<!doctype html>
<html>
<head>
    <title>Error | UniSphere</title>
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
        <div class="login-card stagger-1" style="text-align: center;">
            <h1 style="font-size: 48px; color: var(--urgent-red);">500</h1>
            <h2>Something went wrong</h2>
            <p class="small-text" style="color: var(--text-muted); margin-bottom: 20px;">
                An unexpected error occurred. Please try again later.
            </p>
            <div style="display:none;" id="debug-error">
                <p><strong>Exception:</strong> ${request?.exception?.message ?: 'No exception message'}</p>
                <p><strong>Cause:</strong> ${request?.exception?.cause?.message ?: 'No cause'}</p>
                <p><strong>Class:</strong> ${request?.exception?.getClass()?.name ?: 'Unknown'}</p>
            </div>
        </div>
    </div>
</body>
</html>
