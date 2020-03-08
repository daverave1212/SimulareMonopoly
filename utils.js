
function loadJsonFromFile(fileName, callback){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		callback(myObj);
	  }
	};
	xmlhttp.open("GET", "fileName", true);
	xmlhttp.send();
}

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low)) + low 
}

function d6(){
    return randomInt(1, 7)
}

function cardNameToPath(cardName){
	var start = 0;
	var end = 0;
	var ret = "";
	for(var i = 0; i<cardName.length; i++){
		console.log("at " + i + ", start:" + start + ", end" + end);
		if(cardName[i] == "'"){
			ret += cardName.substr(start, end);
			start = i+1;
			end = i+1;
		} else {
			end++;
		}
	}
	if(start != end){
		ret += cardName.substr(start, end);
	}
	return ret + ".png";
}





