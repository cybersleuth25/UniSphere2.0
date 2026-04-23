<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title><g:layoutTitle default="UniSphere"/></title>

    <%-- Google Fonts: Midnight Ethereal Editorial --%>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Karla:wght@400;500;700&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <%-- Asset Pipeline CSS --%>
    <asset:stylesheet src="style.css"/>

    <g:layoutHead/>
</head>
<body class="${pageProperty(name: 'body.class')}">
    
    <%-- Ethereal Background Effects --%>
    <div class="noise-overlay"></div>
    <div class="ethereal-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>

    <g:layoutBody/>

    <%-- Marked.js for markdown rendering --%>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.0.2/marked.min.js"></script>


    <%-- Asset Pipeline JS --%>
    <asset:javascript src="application.js"/>

</body>
</html>
