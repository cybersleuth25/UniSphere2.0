<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title><g:layoutTitle default="UniSphere"/></title>

    <%-- Google Fonts (same as PHP version) --%>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Poppins:wght@600&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <%-- Asset Pipeline CSS --%>
    <asset:stylesheet src="style.css"/>

    <g:layoutHead/>
</head>
<body class="${pageProperty(name: 'body.class')}">

    <g:layoutBody/>

    <%-- Marked.js for markdown rendering (same as PHP version) --%>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.0.2/marked.min.js"></script>

    <%-- Particles.js --%>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>

    <%-- Asset Pipeline JS --%>
    <asset:javascript src="application.js"/>

</body>
</html>
