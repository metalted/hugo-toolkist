+++
title = 'ZDL'
+++

{{<rawhtml>}}

<!-- HTML Meta Tags -->
<title>ZDL | Toolkist</title>
<meta name="description" content="A collection of the 50 hardest tracks in Zeepkist.">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="https://toolkist.netlify.app/zdl">
<meta property="og:type" content="website">
<meta property="og:title" content="ZDL | Toolkist">
<meta property="og:description" content="A collection of the 50 hardest tracks in Zeepkist.">
<meta property="og:image" content="https://opengraph.b-cdn.net/production/documents/6dcc0769-ade4-440f-aec9-074324414b8f.png?token=TxD6WeXkODitlxdL1XChSy2XouG2MH2_P9Ln0DuKmBc&height=675&width=1200&expires=33249247456">
<meta name="theme-color" content="#9603ff">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="toolkist.netlify.app">
<meta property="twitter:url" content="https://toolkist.netlify.app/zdl">
<meta name="twitter:title" content="ZDL | Toolkist">
<meta name="twitter:description" content="A collection of the 50 hardest tracks in Zeepkist.">
<meta name="twitter:image" content="https://opengraph.b-cdn.net/production/documents/6dcc0769-ade4-440f-aec9-074324414b8f.png?token=TxD6WeXkODitlxdL1XChSy2XouG2MH2_P9Ln0DuKmBc&height=675&width=1200&expires=33249247456">

<style>
.zdl-row
{
    width: calc(100% - 18px);
    height: 180px;
    margin: 6px;

    background-color: rgb(34,34,34);
    color: rgb(251, 199, 25);

    display: flex;
    flex-direction: row;
    overflow: hidden;
    border-radius: 12px;
    border: 3px solid rgb(34,34,34);
    box-sizing:border-box;
}

.zdl-rank
{
    width: 72px;
    height: 100%;
    position: relative;
    border-right: 3px solid rgb(34,34,34);
}

.zdl-index
{
    position: absolute;
    height: 36px;
    width: 66px;
    top: 6px;
    left: 6px;
    text-align: center;
    font-size: 28px;
    line-height: 36px;
    background-color: black;
    border-radius: 6px 0 0 6px;
    background-color: rgb(34,34,34,0.5);
    user-select:none;
}

.zdl-points
{
    position: absolute;
    height: 72px;
    width: 66px;
    top: 48px;
    left: 6px;
    text-align: center;
    font-size: 18px;
    line-height: 33px;
    padding-top: 6px;
    background-color: black;
    border-radius: 6px 0 0 6px;
    background-color: rgb(34,34,34, 0.5);
    box-sizing: border-box;
    user-select:none;
}

.zdl-steam
{
    position: absolute;
    height: 42px;
    width: 66px;
    bottom: 6px;
    left: 6px;
    background-color: black;
    border-radius: 6px 0 0 6px;
    background-color: rgb(34,34,34, 0.5);
    background-image: url('/steamIconYellow.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.zdl-steam:hover
{
    background-color: rgb(255, 255, 255, 0.3);
    cursor: pointer;
}

.zdl-image 
{
    width: 282px;
    height: 180px;  
    object-fit: cover;
    border-right: 3px solid rgb(34,34,34);
}

.zdl-content
{
    height: 100%;
    flex: 1;
    position: relative;
    color: rgb(251, 199, 25);
}

.zdl-header
{
    position: absolute;
    height: 36px;
    top: 6px;
    left: 0px;
    right: 6px;
    text-align: left;
    font-size: 18px;
    line-height: 36px;
    background-color: black;
    border-radius: 0 6px 6px 0;
    background-color: rgb(34,34,34,0.5);
    user-select:none;
    padding-left: 12px;
    white-space: nowrap;
    overflow: hidden;
}
.zdl-header span
{
    margin-left: 6px;
    margin-right: 6px;
}

.zdl-description
{
    position: absolute;
    width: 360px;
    top: 96px;
    left: 0px;
    bottom: 6px;
    text-align: left;
    font-size: 18px;
    background-color: black;
    border-radius: 0 6px 6px 0;
    background-color: rgb(34,34,34,0.5);
    user-select:none;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 6px;
}

.zdl-authorTime
{
    position: absolute;
    width: 360px;
    height: 42px;
    top: 48px;
    left: 0px;
    text-align: left;
    font-size: 18px;
    background-color: black;
    border-radius: 0 6px 6px 0;
    background-color: rgb(34,34,34,0.5);
    user-select:none;
    box-sizing: border-box;
    overflow-y: auto;
}

.zdl-authorTime-medal
{
    width: 30px;
    height: 30px;
    position: absolute;
    left: 6px;
    top: 6px;

    background-image: url('/medal_author.png');
    background-size: 95%;
    background-repeat: no-repeat;
    background-position: center;
}

.zdl-authorTime span
{
    height: 30px;
    line-height: 30px;
    position: absolute;
    top: 6px;
    left: 42px;
}

.zdl-records
{
    position: absolute;
    top: 48px;
    right: 6px;
    bottom: 6px;
    left: 366px;
    text-align: left;
    font-size: 32px;
    line-height: 54px;
    background-color: black;
    border-radius: 6px;
    background-color: rgb(34,34,34,0.5);
    user-select:none;
    padding: 6px;
    overflow-y: auto;
}

.orangeText{
    color: rgb(239, 107, 35) !important;
}

.zdl-record-table
{
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 6px;
}

.zdl-record-table tr
{
    background-color: rgb(34,34,34,0.5);
    height: 24px;
    padding-bottom: 3px;
    border-radius: 6px;
}

.zdl-record-table tr td
{
    height: 24px;
    font-size: 18px;
    line-height:24px;
    padding-left: 6px;
    overflow:hidden;
    white-space: nowrap;
}

#zdlMainList, #zdlLegacyList, #zdlScoreboard
{
    display: none;
}

.standardButton
{
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 6px;
}

.headerBlock{
    margin-bottom: 6px;
}

#zdlLoadingPage
{
    display: flex;
    justify-content: center;
    align-items: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-circle {
  width: 100px; /* Adjust the size of the circle */
  height: 100px; /* Adjust the size of the circle */
  border-radius: 50%;
  border: 12px solid rgb(251,199,25); /* Color of the circle border */
  border-top-color: rgb(34,34,34); /* Color of the animated part of the circle */
  animation: spin 1s linear infinite; /* Animation for spinning */
}

.youtubeButtonValidation
{
    width: 30px;
    height: 24px;
    position: absolute;
    right: 9px;
    top: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    border-radius: 3px;
    box-sizing: border-box;
    font-size: 10px;
    color : white;
}

.youtubeButtonRecord
{
    width: 26px;
    height: 18px;
    position: absolute;
    right: 3px;
    top: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    border-radius: 3px;
    font-size: 8px;
    color : white;
}

.youtubeButtonValidation:hover, .youtubeButtonRecord:hover 
{
    border: 1px solid white;
    cursor: pointer;
}

</style>
<script type="module" src='/toolkist/zdl.pages.toolkist.js'></script>
<div id="content" class='flex_content'>
    <div class='standardLeftPanel'></div>
    <div class='standardPagePanel' id='zdlLoadingPage'><div class="loading-circle"></div></div>
    <div class='standardPagePanel' id='zdlMainList'></div>
    <div class='standardPagePanel' id='zdlLegacyList'></div>
    <div class='standardPagePanel' id='zdlScoreboard'></div>
</div>
{{</rawhtml>}}