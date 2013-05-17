$(function () {

    $("#say").click(function () {
        //ひらがなチェック
        var words = $("#words").val();
        if(words.match(/^[ぁ-ん]+$/)) {
            socket.emit('say', { words: words });
        } else {
            alert("ひらがなだけしかダメです");
        }
    });

    init();
});

//var host = "http://<your server address>:3000";
var host = "http://localhost:3000";

var socket = io.connect(host);

function init() {
    socket.on('connect', function(msg) {
        console.log("ws connected.");
    });

    socket.on('say', function(data) {
        $("#chatlog").val($("#chatlog").val() + data.words + "\n");
        var audio = new Audio(data.wavUrl);
        audio.play();
    });
}

