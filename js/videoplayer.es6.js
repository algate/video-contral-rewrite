/* ES6 Syntax*/
(function(window, document) {
    class videoPlayer {
        constructor(video) {
            this.id = video.id ? video.id : '';
            this.videoContainer = document.getElementById(this.id);
        }
    }
}(this, document))
