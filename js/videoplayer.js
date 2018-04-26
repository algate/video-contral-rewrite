(function(window, document) {
    var videoContainer = document.getElementById('video_container'),
        video = videoContainer.getElementsByTagName('video')[0],
        videoControls = document.getElementById('videoControls'),
        play = document.getElementById('play'),
        progressContainer = document.getElementById("progress"),
        progressHolder = document.getElementById("progress_box"),
        playProgressBar = document.getElementById("play_progress"),
        progressLine = document.getElementById("progress_line"),
        progressLineTime = document.getElementById("progress_line_time"),
        progressText = document.getElementById('progressText'),
        bufferProgress = document.getElementById('buffer_progress'),
        totalProgress = document.getElementById('progress_total'),
        fullScreenToggleButton = document.getElementById("fullScreen"),
        videoVolumn = document.getElementById("videoVolumn"),
        videoVolumnTotal = videoVolumn.getElementsByClassName("video_volumn_total")[0],
        videoVolumnVolume = videoVolumn.getElementsByClassName("video_volumn_volume")[0],
        volumnHolder = videoVolumn.getElementsByClassName("video_volumn_box")[0],
        // Boolean that allows us to "remember" the current size of the video player.
        isVideoFullScreen = false,
        playProgressInterval = null,
        currentLineTime;
    var videoPlayer = {
        init : function() {
            // this is equal to the videoPlayer object.
            var that = this;
            // this.addSource();
            // Helpful CSS trigger for JS.
            document.documentElement.className = 'js';
            // Get rid of the default controls, because we'll use our own.
            video.removeAttribute('controls');
            // When meta data is ready, show the controls
            video.addEventListener('loadeddata', this.initializeControls, false);
            // 当浏览器正在下载指定的音频/视频时，会发生 progress 事件。
            video.addEventListener('progress',this.videoBufferedProgress, false);
            // When play, pause buttons are pressed.
            // 当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件
            video.addEventListener('canplay',function(){
                if(video.readyState == 4){
                    bufferProgress.style.width = "100%";
                } else {
                    var curWidth = Number(bufferProgress.style.width.replace('%',''));
                    (function addWidth(){
                        bufferProgress.style.width = (curWidth) + (i++) + "%";
                        if(Number(bufferProgress.style.width.replace('%','')) >= 100){
                            bufferProgress.style.width = "100%";
                            clearTimeout(allbufferProgressInterval);
                        }else{
                            var allbufferProgressInterval = setTimeout(addWidth, 50);
                        }
                    })(i=1);
                }
            },false);
            this.handleButtonPresses();
            // 进度条监听事件
            this.videoScrubbing();
            // volumn监听事件
            this.videoVolumn();
            // When the full screen button is pressed...
            fullScreenToggleButton.addEventListener("click", function(){
                isVideoFullScreen ? that.fullScreenOff() : that.fullScreenOn();
            }, true);
        },
        /*addSource: function(){
            window.URL = window.URL || window.webkitURL;
            window.MediaSource = window.MediaSource || window.WebKitMediaSource;
            var assetURL = '../yingyong_720p.mp4';
            var assetURL2 = 'http://vpls.cdn.videojj.com/scene/movie/game/game04.mp4';
            // var assetURL2 = '../frag_bunny.mp4';
            var assetURL3 = '../teacher.mp4';
            var assetURLnew = '../HTML5_history.mp4';
            var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
            if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
                var mediaSource = new MediaSource();
                // console.log(mediaSource.readyState); // closed
                // 创建一个指向一个 MediaSource 对象的 URL。要求此 URL 可以被指定为一个用来播放媒体流的 HTML 媒体元素的 src 的值。
                video.src = window.URL.createObjectURL(mediaSource);
                mediaSource.addEventListener('sourceopen', sourceOpen);
            } else {
                console.error('Unsupported MIME type or codec: ', mimeCodec);
            }
            function sourceOpen () {
              console.log(this.readyState); // open
              var mediaSource = this;
              // MediaSource 的 addSourceBuffer() 方法会根据给定的 MIME 类型创建一个新的 SourceBuffer 对象，然后会将它追加到 MediaSource 的 SourceBuffers 列表中。
              var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
              fetchAB(assetURL2, function (buf) {
                console.log(buf);
                // sourceBuffer.addEventListener('open',function(){
                    sourceBuffer.addEventListener('updateend', function () {
                        mediaSource.endOfStream();
                        console.log(mediaSource.sourceBuffers);
                        console.log(mediaSource.readyState); // ended
                    });
                    sourceBuffer.appendBuffer(buf);
                // })

              });
            };
            function fetchAB (url, cb) {
              // console.log(url);
              var xhr = new XMLHttpRequest;
              xhr.open('get', url);
              xhr.responseType = 'arraybuffer';
              xhr.onload = function () {
                // console.log(xhr);
                cb(xhr.response);
              };
              xhr.send();
            };
        },*/
        /*addSource: function(){
            window.URL = window.URL || window.webkitURL;
            var assetURL = '../yingyong_720p.mp4';
            var assetURL_2 = '../yingyong_720p_2.mp4';
            var assetURL2 = '../frag_bunny.mp4';
            var assetURL3 = '../teacher.mp4';
            var assetURLnew = '../HTML5_history.mp4';
            var assetURL4 = 'http://nettuts.s3.amazonaws.com/763_sammyJSIntro/trailer_test.mp4';
            var xhr = new XMLHttpRequest;
            xhr.open('get', assetURLnew, true);
            xhr.responseType = 'blob';
            xhr.onload = function(){
                console.log(this);
                if(this.status == 200 && this.readyState == 4){
                    var blob = this.response;
                    console.log(blob);
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(blob);
                    // reader.readAsBinaryString(blob);
                    // reader.readAsDataURL(blob);
                    // reader.readAsText(blob);
                    reader.addEventListener("loadend", function() {
                        // reader.result 包含转化为类型数组的blob
                        console.log(reader);
                        var arrayBuffer = reader.result;
                        var dataView = new DataView(arrayBuffer);
                        // 字符串的编码方法是确定的
                        console.log(dataView);
                        // 回归到了二进制语言，解析计算机语言 1 和 0 。只要你肯花功夫，我觉得你会成功的。
                        // var abc16str = String.fromCharCode.apply(null, new Uint16Array(dataView));
                    });
                    video.onload = function(e){
                        window.URL.revokeObjectURL(video.src);
                    }
                    video.src =window.URL.createObjectURL(blob);
                    // video.style.display = 'block';
                }
            }
            xhr.send();
        },*/
        addSource: function(){
            window.URL = window.URL || window.webkitURL;
            var assetURL = '../yingyong_720p.mp4';
            var assetURL2 = '../frag_bunny.mp4';
            var assetURL3 = '../teacher.mp4';
            var assetURL4 = 'http://nettuts.s3.amazonaws.com/763_sammyJSIntro/trailer_test.mp4';
            var blob = new Blob(['yingyong_720p.mp4'], {type: 'video/mp4'});
            var url = URL.createObjectURL(blob);
            console.log(url);
            video.src = url;
        },
        /*readBlobAsDataURL: function(blob,callback){
            var a = new FileReader();
            a.onload = function(e) {callback(e.target.result);};
            a.readAsDataURL(blob);
        },*/
        /*dataURLtoBlob: function(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        },*/
        videoBufferedProgress: function(){
            console.log('video is downloading:', video.buffered);
            if(video.buffered.length){
                var bufferPercent = video.buffered.end(0)/video.duration * 100;
                bufferProgress.style.width = bufferPercent + '%';
            }
        },
        initializeControls : function() {
            // When all meta information has loaded, show controls
            console.log('all meta information has loaded, show controls');
            videoPlayer.showHideControls();
        },
        showHideControls : function() {
            // Shows and hides the video player.
            video.addEventListener('mouseover', function() {
                videoControls.style.opacity = 1;
            }, false);
            videoControls.addEventListener('mouseover', function() {
                videoControls.style.opacity = 1;
            }, false);
            video.addEventListener('mouseout', function() {
                videoControls.style.opacity = 0;
            }, false);
            videoControls.addEventListener('mouseout', function() {
                videoControls.style.opacity = 0;
            }, false);
        },
        handleButtonPresses : function() {
            // When the video or play button is clicked, play/pause the video.
            video.addEventListener('click', this.playPause, false);
            play.addEventListener('click', this.playPause, false);
            // When the play button is pressed,
            // switch to the "Pause" symbol.
            video.addEventListener('play', function() {
                play.title = 'Pause';
                play.innerHTML = '';
                // Begin tracking video's progress.
                videoPlayer.trackPlayProgress();
            }, false);
            // When the pause button is pressed,
            // switch to the "Play" symbol.
            video.addEventListener('pause', function() {
                play.title = 'Play';
                play.innerHTML = '';
                videoPlayer.stopTrackingPlayProgress();
            }, false);
            // When the video has concluded, pause it.
            video.addEventListener('ended', function() {
                this.currentTime = 0;
                this.pause();
            }, false);
        },
        playPause: function() {
            if ( video.paused || video.ended ) {
                if ( video.ended ) {
                    video.currentTime = 0;
                }
                video.play();
            } else {
                video.pause();
            }
        },
        fullScreenOn : function() {
            isVideoFullScreen = true;
            // Set new width according to window width
            // video.webkitRequestFullScreen();
            // videoContainer.webkitRequestFullScreen();
            function fullScreen(videoContainer) {
                if (element.requestFullScreen) {
                    element.requestFullScreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                }
            }
            videoContainer.style.cssText = 'position: fixed; width:100%; height:100%';
            // Apply a classname to the video and controls, if the designer needs it...
            videoControls.style.cssText = 'position: fixed;';
            fullScreenToggleButton.innerHTML = '';
            console.log('full');
            // Listen for escape key. If pressed, close fullscreen.
            document.addEventListener('keydown', this.checkKeyCode, false);
        },
        fullScreenOff : function() {
            isVideoFullScreen = false;
            // videoContainer.webkitcancelFullScreen();
            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
            videoContainer.style.position = 'static';
            fullScreenToggleButton.innerHTML = '';
            console.log('unfull')
            videoControls.style.cssText = '';
        },
        // Determines if the escape key was pressed.
        checkKeyCode : function( e ) {
            e = e || window.event;
            if ( (e.keyCode || e.which) === 27 )
                videoPlayer.fullScreenOff();
        },
        // Every 50 milliseconds, update the play progress.
        trackPlayProgress : function(){
            (function progressTrack() {
                videoPlayer.updatePlayProgress();
                playProgressInterval = setTimeout(progressTrack, 50);
            })();
        },
        updatePlayProgress : function(){
            playProgressBar.style.width = ( (video.currentTime / video.duration) * (progressHolder.offsetWidth) ) + "px";
            progressText.innerHTML = videoPlayer.formatTime(video.currentTime).time2;
        },
        // Video was stopped, so stop updating progress.
        stopTrackingPlayProgress : function(){
            clearTimeout( playProgressInterval );
        },
        videoScrubbing : function() {
            // 进度条多动操作
            /*progressHolder.addEventListener("mousedown", function(e){
                videoPlayer.stopTrackingPlayProgress();
                videoPlayer.playPause();
                console.log(e.pageX);
                document.onmousemove = function(e) {
                    videoPlayer.setPlayProgress( e.pageX );
                }
                progressHolder.onmouseup = function(e) {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    video.play();
                    videoPlayer.setPlayProgress( e.pageX );
                    videoPlayer.trackPlayProgress();
                }
            }, true);*/
            progressHolder.addEventListener('mouseenter', function(){
                progressLine.style.display = 'block';
                // video.pause();
                // videoPlayer.stopTrackingPlayProgress();
                document.onmousemove = function(e) {
                    videoPlayer.setPlayProgress( e.pageX );
                }
            },false);
            progressHolder.addEventListener('mouseleave', function(e){
                progressLine.style.display = 'none';
                document.onmousemove = null;
            },true);
            progressHolder.addEventListener('click',function(e){
                video.currentTime = currentLineTime;
                videoPlayer.updatePlayProgress();
                video.play();
            });
        },
        setPlayProgress : function( clickX ) {
            progressLine.style.left = clickX - progressLine.offsetWidth/2 - videoControls.offsetLeft + 'px';
            var newPercent = (progressLine.offsetLeft - progressContainer.offsetLeft + progressLine.offsetWidth/2)/progressContainer.offsetWidth;
            currentLineTime = video.duration * newPercent;
            progressLineTime.innerHTML = videoPlayer.formatTime(currentLineTime).time2;
        },
        videoVolumn: function() {
            video.volumn = 0.5;
            videoVolumnVolume.style.width = '50%';
            volumnHolder.addEventListener("mousedown", function(e){
                video.volumn = e.offsetX/100;
                videoVolumnVolume.style.width = video.volumn * 100 + '%';
                volumnHolder.onmousemove = function(e) {
                    video.volumn = e.offsetX/100;
                    videoVolumnVolume.style.width = video.volumn * 100 + '%';
                }
                document.onmouseup = function(e) {
                    document.onmouseup = null;
                    document.onmousemove = null;
                    volumnHolder.onmousemove = null;
                }
            }, true);
            volumnHolder.addEventListener('mouseup', function(e){
                volumnHolder.onmousemove = null;
                volumnHolder.onmouseup = null;
            });
            volumnHolder.addEventListener('click',function(e){
                console.log(e.offsetX);
                console.log(video.volumn);
                video.volumn = e.offsetX/100;
                videoVolumnVolume.style.width = video.volumn * 100 + '%';
            });
        },
        formatTime: function(timeStr){
            timeStr = Math.floor(timeStr*1000)
            var timeObj = {};
            var time=new Date();
            if(typeof timeStr!="undefined"){
                time=new Date(Number(timeStr));
            }
            function addZero(num){
                return num < 10 ? '0' + num : num;
            }
            var year=time.getFullYear();
            var month=addZero(time.getMonth()+1);
            var day=addZero(time.getDate());
            var week=time.getDay();
            var weekStr="日一二三四五六";
            var hour=addZero(time.getHours());
            var minute=addZero(time.getMinutes());
            var second=addZero(time.getSeconds());
            var standardTime=year+"年"+month+"月"+day+"日 星期"+weekStr.charAt(week)+" "+hour+":"+minute+":"+second;
            var fullDate = year+"-"+month+"-"+day;
            var date=month+"月"+day+"日";
            var HandM = hour+":"+minute;
            var MandS = minute+':'+second;
                var originalTime = new Date(0);
                var difTime = (time - originalTime)/1000;
            timeObj.standardTime = standardTime;
            timeObj.fullDate = fullDate;
            timeObj.date = date;
            timeObj.time = HandM;
            timeObj.time2 = MandS;
            timeObj.time3 = addZero(Math.floor(difTime-difTime%60)/60)+':'+addZero(difTime%60);
            return timeObj;
        }
    };
    videoPlayer.init();
}(this, document))
