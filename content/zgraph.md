+++
title = 'ZGraph'
+++

{{<rawhtml>}}
<!-- HTML Meta Tags -->
<title>ZGraph | Toolkist</title>
<meta name="description" content="A 2D Graphics Editor for Zeepkist">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="https://toolkist.netlify.app/zgraph">
<meta property="og:type" content="website">
<meta property="og:title" content="ZDL | ZGraph">
<meta property="og:description" content="A 2D Graphics Editor for Zeepkist">
<meta property="og:image" content="/img/Zgraph_banner.png">
<meta name="theme-color" content="#fbc719">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="toolkist.netlify.app">
<meta property="twitter:url" content="https://toolkist.netlify.app/zgraph">
<meta name="twitter:title" content="ZDL | ZGraph">
<meta name="twitter:description" content="A 2D Graphics Editor for Zeepkist">
<meta name="twitter:image" content="/img/ZGraph_banner.png">

<style>
    .standardPagePanel
    {
        position: relative;
    }

    .zgraph-menubar
    {
        background-color: #FBC719;
        height: 60px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 990;
        display: flex;
        flex-direction: row;
    }

    .zgraph-sidebar
    {
        background-color: #555555;
        width: 250px;
        position: absolute;
        bottom: 0;
        left:0;
        top: 60px;
    }

    .zgraph-worksheet
    {
        position: absolute;
        top: 60px;
        left: 250px;
        bottom: 0;
        right: 0;
        background-color: #00000077;
    }

    .zgraph-menubar-button
    {
        width: 60px;
        height: 60px;
        background-color: #FBC719;
        padding: 10px;
        box-sizing: border-box;
        border-right: 1px solid black;
        position: relative;
    }

    .zgraph-menubar-button:hover
    {
        background-color: #EF6B23;
        cursor: pointer;
    }


    .zgraph-menubar-button-icon
    {
        width: 40px;
        height: 40px;
        font-size: 40px;
        line-height: 40px;
        text-align: center;
    }

    .zgraph-menubar-button-tooltip
    {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        display: none;
        white-space: nowrap;
        background: #00000077;
        text-align: center;
        color: white;
    }

    .selection-box
    {
        color: rgb(34,34,34);
        background-color: #FBC719;
        margin-top: 10px;
        line-height: 30px;
    }

    .list-item
    {
        line-height: 30px;
    }

    .list-item:hover
    {
        background-color: #EF6B23;
    }

    .selected
    {
        background-color: #FBC719;
        color: rgb(34,34,34);        
    }

    #controlsButton
    {
        position:absolute;
        right: 10px;
        top: 10px;
        text-align: right;
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        flex: 1;
        text-shadow: -2px 2px 1px rgb(239, 107, 35);

    }

    #controlsTable
    {
        position: absolute;
        top: 60px;
        right: 0;
        z-index: 999;
        background-color: #FBC719;
        color: rgb(34,34,34);
        width: 300px;
        border: 1px solid rgb(239, 107, 35);
    }

    .selection-box-preview{
        border: 1px solid black;
        box-sizing: border-box;
    }

</style>
<script src='/libs/fabric.min.js'></script>
<script type="module" src='/toolkist/zgraph.pages.toolkist.js'></script>
<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
        <div class='zgraph-container'></div>
    </div>
</div>
{{</rawhtml>}}