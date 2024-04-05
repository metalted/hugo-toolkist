+++
title = 'ZDL'
+++

{{<rawhtml>}}
<style>
.zdl-row
{
    width: calc(100% - 18px);
    height: 240px;
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
    height: 54px;
    width: 66px;
    top: 6px;
    left: 6px;
    text-align: center;
    font-size: 48px;
    line-height: 54px;
    background-color: black;
    border-radius: 6px 0 0 6px;
    background-color: rgb(34,34,34,0.5);
    user-select:none;
}

.zdl-points
{
    position: absolute;
    height: 90px;
    width: 66px;
    top: 66px;
    left: 6px;
    text-align: center;
    font-size: 24px;
    line-height: 33px;
    padding-top: 9px;
    background-color: black;
    border-radius: 6px 0 0 6px;
    background-color: rgb(34,34,34, 0.5);
    box-sizing: border-box;
    user-select:none;
}

.zdl-steam
{
    position: absolute;
    height: 66px;
    width: 66px;
    bottom: 6px;
    left: 6px;
    text-align: center;
    font-size: 48px;
    line-height: 54px;
    background-color: black;
    border-radius: 6px 0 0 6px;
    background-color: rgb(34,34,34, 0.5);
    background-image: url('/steamIconYellow.png');
    background-size: 90%;
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
    width: 376px;
    height: 240px;  
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
    height: 54px;
    top: 6px;
    left: 0px;
    right: 6px;
    text-align: left;
    font-size: 24px;
    line-height: 54px;
    background-color: black;
    border-radius: 0 6px 6px 0;
    background-color: rgb(34,34,34,0.5);
    user-select:none;
    padding-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    color: 
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
    top: 114px;
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
}

.zdl-authorTime
{
    position: absolute;
    width: 360px;
    height: 42px;
    top: 66px;
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

.zdl-description
{
    padding: 6px;
    box-sizing: border-box;
}

.zdl-records
{
    position: absolute;
    top: 66px;
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
</style>
<script type="module" src='/toolkist/zdl.pages.toolkist.js'></script>
<div id="content" class='flex_content'>
    <div class='standardLeftPanel'></div>
    <div class='standardPagePanel' id='zdlMainList'>Loading...</div>
</div>
{{</rawhtml>}}