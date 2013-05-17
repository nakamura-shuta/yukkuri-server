var crypto = require('crypto');
var exec = require('child_process').exec;
var fs = require("fs");


//音声合成プログラムのディレクトリ
var YUKKURI_DIR = "/home/ec2-user/yukkuri/";
//音声合成プログラムのフルパス
var YUKKURI_PATH = YUKKURI_DIR + "MyTalk";
//音声ファイルの出力先ディレクトリ
var MEDIA_PATH = "/home/ec2-user/yukkuri-server/public/media/";

/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'ゆっくりチャット' });
};

/**
 * 入力された文字を音声合成して出力したファイルパスと文言をブロードキャスト
 */
exports.say = function (io,words) {
    //waveファイル名
    var waveFile = crypto.createHash('md5').update(words, 'utf8').digest("hex") + ".wav";
    //waveファイルパス
    var outPath = MEDIA_PATH + waveFile;
    //すでにファイルがあればtrue
    var exists = false;

    if(fs.existsSync(outPath)) {
        console.log("wave file exists.")
        exists = true;
    }
    makeWave(words,outPath,waveFile,exists,function(){
        io.sockets.emit('say', { res: "ok", "words":words,"wavUrl": "/media/" + waveFile});
    });
};


/**
 * waveファイルがまだなければ作成する
 */
function makeWave(words, outPath, waveFile,exists,callback) {
    if(!exists) {
        //wave生成

        exec('cd ' + YUKKURI_DIR + ' && echo ' + words + ' | ' + YUKKURI_PATH + ' > ' + outPath, function (err, stdout, stderr) {
            if(err) console.log(err);
            if (callback) {
                callback();
            }
        });
    } else {
        callback();
    }
}
