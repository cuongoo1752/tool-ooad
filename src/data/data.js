var qz1, qz2, qz3;


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//usage:
readTextFile("/qz1.json", function(text) {
    qz1 = JSON.parse(text);
});

readTextFile("./qz2.json", function(text) {
    qz2 = JSON.parse(text);
});

readTextFile("./qz3.json", function(text) {
    qz3 = JSON.parse(text);
});

export const quiz1 = qz1;
export const quiz2 = qz2;
export const quiz3 = qz3;