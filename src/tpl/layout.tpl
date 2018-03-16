<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{title}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <script>
        function setViewPort(){
            var clientWidth = document.documentElement.clientWidth;
            if(clientWidth > 750) {
                clientWidth = 750
            };
            document.documentElement.style.fontSize = clientWidth / 7.5 + 'px';
        }
        setViewPort();
        window.onresize = setViewPort;
    </script>
    <script src="//docs-resource.csmall.com/js/pace.min.js"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
