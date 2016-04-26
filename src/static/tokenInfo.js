var data = JSON.parse(document.getElementById("tokenData").innerHTML);
for (var i in data) {
	window[i] = data[i];
}