+++
title = 'ZDL'
+++

{{<rawhtml>}}
<style>
.zdl-row
{
  display: flex;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgb(34,34,34);
  margin: 3px;
  flex-direction: column;
  color: rgb(251, 199, 25);
  width: 100%;
}

.zdl-header
{
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
}

.zdl-index, .zdl-name, .zdl-creator, .zdl-by
{
    height: 100%;
    display: flex;
    justify-content: center;
    justify-content: center;
    align-items: center;
    padding-right: 20px;
}

.zdl-index
{
    width: 40px;
    padding-right: 0px;
}

.zdl-index span
{
    font-size: 24px;
}

.zdl-name, .zdl-creator
{
    color: rgb(239, 107, 35) !important;
}

.zdl-body
{
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
}

.zdl-image 
{
  flex-shrink: 0;
  width: 250px;
  height: 100%;
  object-fit: cover;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.zdl-info
{
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.zdl-info-header
{
    color: rgb(239, 107, 35) !important;
}

.zdl-record-list
{
    flex: 2;
    height: 100%;
}

.zdl-record-list-header
{
    color: rgb(239, 107, 35) !important;
}

.zdl-record-list-body
{
    max-height: 123px;
    overflow-y: auto;
}

.ampersand
{
    color: rgb(251, 199, 25);
    padding-left: 5px;
    padding-right: 5px;
}

.zdl-record-table
{
    width: 80%;
}

.zdl-record-table tr
{
    border: 1px solid rgb(251, 199, 25);
}

.zdl-record-table td
{
    padding: 5px;
    height: 20px;
}

</style>
<script type="module" src='/toolkist/zdl.pages.toolkist.js'></script>
<div id="content" class='flex_content'>
    <div class='standardPagePanel'>Loading...</div>
</div>
{{</rawhtml>}}