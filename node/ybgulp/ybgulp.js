// load the filesystem module
var fs = require('fs');


// read the files from build
fs.readdir('build', function(err, files){
	console.log(files);

	// create or clean out the deploy folder first
	newFolder('deploy');

	// then deploy each file from build
	for(var i=0; i<files.length; i++){
		deploy(files[i]);
	}
	console.log(files.length+' files deployed');
});



// this function creates a new folder or clears out an existing one
function newFolder(foldername){
	fs.exists(foldername, function(exists){
		if(!exists){
			fs.mkdir(foldername);
			console.log(foldername+' folder created');
		}
		else{
			empty(foldername);
		}
	});
}


// this function clears out a directory
function empty(directory){
	fs.readdir(directory, function(err, files){
		if(err) throw err;

		// delete each file in directory
		var filenum = files.length;
		for(var i=0; i<files.length; i++){
			fs.unlink(directory+'/'+files[i], function(err){
				if(err) throw err;
			});
		}
		console.log(filenum + ' files deleted');
	});
}


// this function deploys an individual file
function deploy(filename){

	// read a file from the build folder
	fs.readFile('build/'+filename, function(err, data){
		if(err) throw err;

		// check that it's a code file
		function isCode(thefile){return thefile.search(/(.htm|.js)/i) > -1}

		// if the file is code, compress it before deploying it
		var output = isCode(filename) ? compress(data.toString()) : data;

		// deploy the file
		fs.writeFile('deploy/'+filename, output, function(err){
			if(err) throw err;
			console.log(filename+' created');
		});
	});
}


// compresses code
function compress(str){
	return str.replace(/(\s|^)\/\/[^\n]*/gmi, '') // remove single-line js comments
				.replace(/;\/\/[^\n]*/gmi, ';') // remove single-line js comments directly after a semicolon
				.replace(/(\t|(\n(?!\w)))/gi, '') // remove tabs and line breaks
				.replace(/\n/gi, ' ') // replace line breaks in text with spaces
				.replace(/\/\*[^\/]*\*\//gi, '') // remove multi-line js comments
				.replace(/; +/g, ';') // remove spaces after semicolons
				.replace(/\{ +/g, '{') // remove spaces after curly braces
				.replace(/ \= /g, '=') // replace spaces around equals signs
				.replace(/ \+ /g, '+') // ditto for plus, times, or, comma, etc
				.replace(/ \* /g, '*')
				.replace(/ \|\| /g, '||')
				.replace(/, /g, ',')
				.replace(/<!--[^!]*-->/g, '') // remove html comments
				;
}