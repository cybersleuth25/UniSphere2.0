<!doctype html>
<html>
<head>
    <title>Error | UniSphere</title>
    <asset:stylesheet src="style.css"/>
</head>
<body class="auth-page-body">
    <div class="login-container">
        <div class="login-card" style="text-align: center;">
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
