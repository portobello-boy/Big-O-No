import 'file-saver';

download(){
	var fileSaver =  require('file-saver');
	var blob = new Blob("big brain file downloader");
	fileSaver.saveAs(blob,"test.txt");
}

upload(){
	//nothing so far
}

export {
	download,
	upload
}
