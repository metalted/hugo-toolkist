+++
title = 'ZST'
+++

{{<rawhtml>}}

<!-- HTML Meta Tags -->
<title>ZST | Zeepkist Speed Running Team</title>
<meta name="description" content="Zeepkist Speedrunning Team">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="https://toolkist.netlify.app/zst">
<meta property="og:type" content="website">
<meta property="og:title" content="ZST | Toolkist">
<meta property="og:description" content="Zeepkist Speedrunning Team">
<meta property="og:image" content="/img/ZST_Banner.png">
<meta name="theme-color" content="#FD66C3">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="toolkist.netlify.app">
<meta property="twitter:url" content="https://toolkist.netlify.app/zst">
<meta name="twitter:title" content="ZST | Zeepkist Speed Running Team">
<meta name="twitter:description" content="Zeepkist Speedrunning Team">
<meta name="twitter:image" content="/img/ZST_Banner.png">

<link rel="stylesheet" href="/css/zst.toolkist.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

<script src="/toolkist/zst.dummy.js"></script>
<script src="/toolkist/zst.toolkist.js"></script> 
<script>
    $(document).ready(function() {        
        zst.Initialize();       
        zst.OpenPage('loader-panel');
        zst.RetreiveData(function(){    
            zst.SetWhatWeDo(zst.data.pageContent.home.whatWeDo);
            zst.SetRules(zst.data.pageContent.rules.rules);
            zst.GenerateRecordTable();          
            zst.FillTeamPage();
            
            const latest = zst.GetLatestRecords(3);

            latest.forEach((record, index) =>
            {
                zst.SetRecentRecordVideo(index + 1, zst.GetCategoryName(record.cat) + " " + record.key, zst.GetUserName(record.user), record.time, record.ytID );
            });

            zst.SwitchToPage('home-panel'); 
            zst.SetLinksState(true);
        });
    });
</script>

<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
        <div id='toolbar'>
            <div id='toolbar-logo'></div>
            <div id='toolbar-title'>Zeepkist Speedrunning Team</div>
            <div id='toolbar-links' class='hidden'>
                <div class='toolbar-link' id="link|home-panel">Home</div>
                <div class='toolbar-link' id="link|records-panel">Records</div>
                <div class='toolbar-link' id="link|team-panel">Team</div>
                <div class='toolbar-link' id="link|rules-panel">Rules</div>
            </div>
        </div>
        <div id='background-panel'></div>
        <div id='loader-panel' class='content-panel hidden'>
            <img src="/img/zst_loader.png" class="loader-image">
        </div>
        <div id='home-panel' class='content-panel hidden'>
            <div id='objective-title'>What We Do</div>
            <div id='objective-content'></div>
            <div id='recent-world-records-title'>Recent Records</div>
            <div id='recent-world-record-videos'>
                <div class='video-container' id="video-container1">
                    <iframe src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="video-info">                        
                        <div class="record-track"></div>
                        <div class="record-user"></div>
                        <div class="record-time"></div>
                    </div>
                </div>
                <div class='video-container' id="video-container2">
                    <iframe src=""  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="video-info">
                        <div class="record-track"></div>
                        <div class="record-user"></div>
                        <div class="record-time"></div>
                    </div>
                </div>
                <div class='video-container' id="video-container3">
                    <iframe src=""  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="video-info">
                        <div class="record-track"></div>
                        <div class="record-user"></div>
                        <div class="record-time"></div>
                    </div>
                </div>                
            </div>
            <div id="discord-section">
                <h2>Join Our Discord Channel</h2>
                <div class="discord-channel" onclick="window.open('https://discord.gg/wfvRzrc8hm', '_blank')">
                    <svg width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                        <g>
                            <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">
                            </path>
                        </g>
                    </svg>
                    <span>ZST Discord</span>
                </div>                
            </div>
        </div>
        <div id='records-panel' class='content-panel hidden'>
            <div id='objective-title'>Records</div>
            <div id='record-table-container'>
                <div id='record-table-toolbar'>
                    <select id='record-type-selection'>
                        <option value='official'>Official</option>
                        <option value='nocheese'>No Cheese</option>
                        <option value='any'>Any %</option>
                        <option value='multiplayer'>Multiplayer</option>
                    </select>
                    <select id='record-level-group-selection'>
                        <option value="A">A Levels</option>
                        <option value="B">B Levels</option>
                        <option value="C">C Levels</option>
                        <option value="D">D Levels</option>
                        <option value="E">E Levels</option>
                        <option value="F">F Levels</option>
                        <option value="G">G Levels</option>
                        <option value="H">H Levels</option>
                        <option value="I">I Levels</option>
                        <option value="X">X Levels</option>
                        <option value="Y">Y Levels</option>
                        <option value="CL">CL Levels</option>
                        <option value="EZ">EZ Levels</option>
                        <option value="FL">FL Levels</option>
                        <option value="OR">OR Levels</option>
                        <option value="XG">XG Levels</option>
                    </select>
                </div>
                <div id='record-table-content'></div>
            </div>
        </div>
        <div id='team-panel' class='content-panel hidden'>
            <div id='objective-title'>Team</div>
            <div id='team-table-container'></div>
        </div>
        <div id='rules-panel' class='content-panel hidden'>
            <!-- Content for Rules section -->
            <div id='objective-title'>Rules</div>
            <div id='rules-list'></div>
        </div>
    </div>
</div>
{{</rawhtml>}}