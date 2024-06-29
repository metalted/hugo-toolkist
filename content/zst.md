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

<style>
    .standardPagePanel {
        color: #CB6BE6;
        position: relative;
    }

    #toolbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background-color: #222222;
        display: flex;
        flex-direction: row;
    }

    #toolbar-logo {
        background-color: #FD66C3;
        width: 52px;
        height: 52px;
        margin: 4px;
        margin-right: 32px;
    }

    #toolbar-title {
        line-height: 52px;
        margin: 4px;
        height: 52px;
        flex: 1;
        text-align: left;
        font-size: 32px;
        user-select: none;     
        text-shadow: -2px 2px 1px #5d1073;   
    }

    #toolbar-links {
        margin: 4px;
        height: 52px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        user-select: none;
    }

    .toolbar-link {
        margin-left: 16px;
        margin-right: 32px;
        font-size: 32px;
        transition: transform 0.3s ease; /* Smooth transition */
        color: #CB6BE6;
         text-shadow: -2px 2px 1px #5d1073;
    }

    .toolbar-link:hover {
        transform: scale(1.2); /* Grow by 10% */
        color: #FD66C3;
        cursor: pointer;
    }

    #main-page
    {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        background: black;
        overflow: hidden;
        z-index: 1;
    }

    #main-page-content {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 2;
        overflow-y: auto;
        user-select: none;             
    }

    #objective-title {
        width: 100%;
        text-align: center;
        font-size: 48px;
        margin-top: 32px;
        margin-bottom: 32px;
        color: #FD66C3;
        text-shadow: -4px 4px 1px #5d1073;
        user-select: none;     
    }

    #objective-content {
        width: 80%;
        margin: auto auto;
        text-align: center;
        font-size: 24px;
        user-select: none;     
    }

    #recent-world-records-title {
        width: 100%;
        text-align: center;
        font-size: 48px;
        margin-top: 32px;
        margin-bottom: 32px;
        color: #FD66C3;
        text-shadow: -4px 4px 1px #5d1073;
        user-select: none;     
    }

    #recent-world-record-videos {
        width: 80%;
        margin: auto;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        border: 2px solid #CB6BE6;
        padding: 16px;
        border-radius: 8px;
    }

    .video-container {
        width: 30%;
        margin: 16px 0;
        border: 2px solid #FD66C3;
        border-radius: 8px;
        padding: 8px;
        background-color: #383838;
    }

    .video-container iframe {
        width: 100%;
        height: 200px;
    }

    .video-info {
        text-align: center;
        color: #CB6BE6;
        font-size: 18px;
        margin-top: 8px;
    }

    .video-info .record-setter {
        font-weight: bold;
        color: #FD66C3;
    }

    @keyframes wave {
        0% {
            background-position: 0 0;
        }
        50% {
            background-position: 100% 0;
        }
        100% {
            background-position: 0 0;
        }
    }

    #main-page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, #ff66c3, #9603ff, #ff66c3);
        background-size: 200% 200%;
        animation: wave 4s ease infinite;
        opacity: 0.1;
        z-index: 1;
    }

    #discord-section {
        width: 80%;
        margin: 32px auto;
        text-align: center;
    }

    #discord-section h2
    {
        color: #FD66C3;
        text-shadow: -2px 2px 1px #5d1073;
        font-size: 24px;
    }

    .discord-channel {
        display: inline-block;
        margin: 16px;
        text-align: center;
    }

    .discord-channel svg {
        width: 64px;
        height: 64px;
        transition: transform 0.3s ease;
    }

    .discord-channel svg:hover
    {
        transform: scale(1.2); /* Grow by 10% */
         
    }

    .discord-channel svg path
    {
        fill: #CB6BE6;
        transition: fill 0.3s ease;
    }

    .discord-channel svg:hover path
    {
        cursor: pointer;
        fill: #FD66C3;
    }

    .discord-channel span {
        display: block;
        margin-top: 8px;
       color: #FD66C3;
        text-shadow: -2px 2px 1px #5d1073;
        font-size: 18px;
    }    
}
</style>

<div id="content" class='flex_content'>
    <div class='standardPagePanel'>
        <div id='toolbar'>
            <div id='toolbar-logo'></div>
            <div id='toolbar-title'>Zeepkist Speedrunning Team</div>
            <div id='toolbar-links'>
                <div class='toolbar-link'>Home</div>
                <div class='toolbar-link'>Records</div>
                <div class='toolbar-link'>Team</div>
                <div class='toolbar-link'>Rules</div>
            </div>
        </div>
        <div id='main-page'></div>
        <div id='main-page-content'>
            <div id='objective-title'>What We Do</div>
            <div id='objective-content'>ZST Zeepkist Speedrunning Team masters tracks, sets records, and innovates racing techniques. We focus on skill development and competitive excellence.</div>
            <div id='recent-world-records-title'>Recent Records</div>
            <div id='recent-world-record-videos'>
                <div class='video-container'>
                    <iframe src="https://www.youtube.com/embed/2E1Z2qjm7bA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="video-info">
                        <div class="record-setter">John Doe</div>
                        <div>Track: Awesome Track</div>
                        <div>Time: 1:23.456</div>
                        <div>Date: 2023-06-01</div>
                    </div>
                </div>
                <div class='video-container'>
                    <iframe src="https://www.youtube.com/embed/siH-FOxveAg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="video-info">
                        <div class="record-setter">Jane Smith</div>
                        <div>Track: Speedy Track</div>
                        <div>Time: 1:22.789</div>
                        <div>Date: 2023-06-15</div>
                    </div>
                </div>
                <div class='video-container'>
                    <iframe src="https://www.youtube.com/embed/vHiUD5-j7N0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="video-info">
                        <div class="record-setter">Alex Brown</div>
                        <div>Track: Lightning Track</div>
                        <div>Time: 1:21.987</div>
                        <div>Date: 2023-07-10</div>
                    </div>
                </div>                
            </div>
            <div id="discord-section">
                <h2>Join Our Discord Channels</h2>
                <div class="discord-channel" onclick="window.open('https://discord.com/invite/example2', '_blank')">
                    <svg width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                        <g>
                            <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">
                    </path>
                        </g>
                    </svg>
                    <span>General Chat</span>
                </div>
                <div class="discord-channel" onclick="window.open('https://discord.com/invite/example2', '_blank')">
                    <svg width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                        <g>
                            <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">
                    </path>
                        </g>
                    </svg>
                    <span>General Chat</span>
                </div>
                <div class="discord-channel" onclick="window.open('https://discord.com/invite/example2', '_blank')">
                    <svg width="800px" height="800px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                        <g>
                            <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero">
                    </path>
                        </g>
                    </svg>
                    <span>General Chat</span>
                </div>
            </div>
        </div>
    </div>
</div>
{{</rawhtml>}}
