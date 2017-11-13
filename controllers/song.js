'use strict'

var path = require('path');
var fs = require('fs');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');




function saveSong(req,res){
	var song = new Song();
	//recogemos los paramentros que llegan por post y asigamos los valores
	var params = req.body;

	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = 'null';
	song.album = params.album;

	song.save((err,songStored) => {
     if(err){
     	res.status(500).send({message: 'Error al guardar la cancion'});
     }else{
     	if(!songStored){
     	res.status(404).send({message: 'la cancion no ha sido guardada'});	
     	}else{
     		res.status(200).send({song: songStored});
     	}
     }
	});
}



//un solo album
function getSong(req,res){
var songId = req.params.id;
Song.findById(songId,(err,song) => {
	if(err){
		res.status(500).send({message:'Error en la peticion'});
	}else{
		if(!song){
			res.status(404).send({message:'La cancion no existe'});
		}else{
			res.status(200).send({song});
		}
	}
});
}

function getSongs(req,res){
if (req.params.page) {
var page = req.params.page;
}else{
var page =1;
}
var itemsPerPage = 3;

Song.find().sort('number').paginate(page,itemsPerPage,function(err,song,total){

if(err){
	res.status(500).send({message:'error en la peticion'});
}else{

if (!song){
	res.status(404).send({message:'no hay canciones registradas'});
}else{
return res.status(200).send({
pages: total,
song: song
});
}
}
});
}



function updateSong(req,res){
var SongId = req.params.id;
var update = req.body;

Song.findByIdAndUpdate(SongId,update,(err,SongUpdated) =>{
if(err){
res.status(500).send({message: 'Error al guardar el artista'});	
}else{
	if(!SongUpdated){
		res.status(404).send({message: 'El artista no ha sido actualizado'});	
	}else{
		res.status(200).send({song: SongUpdated});	
	}
}	
});
}

function deleteSong(req,res){
var SongId = req.params.id;


Song.findByIdAndRemove(SongId,(err,SongRemoved) =>{
if(err){
res.status(500).send({message: 'Error en el servidor'});	
}else{
	if(!SongRemoved){
		res.status(404).send({message: 'no se ha borrado la canciion'});	
	}else{
		res.status(200).send({song: SongRemoved});	
	}
}	
});
}



//subir audi de song 
function uploadFile(req,res){
var songId = req.params.id;
var  file_name = 'No subido...';

if(req.files){
var file_path = req.files.file.path;
var file_split = file_path.split('\\');
var file_name =file_split[2];
var ext_split = file_name.split('\.');
var file_ext = ext_split[1];

if(file_ext =='mp3' || file_ext =='waw'){

Song.findByIdAndUpdate(songId,{file: file_name}, (err,SongUpdated) => {
if(!SongUpdated){
res.status(404).send({message:'no se ha podido actualizar la cancion'});	
}else{
res.status(200).send({song: SongUpdated});	
}	
});

}else{
res.status(200).send({message: 'extension no valida'});	
}
}else{
res.status(200).send({message: 'no has subido ninguna imagen'});

}
}

//recuperar la cancion 
function getSongFile(req,res){

var imageFile = req.params.songFile;
var path_file ='./uploads/song/'+imageFile;
fs.exists(path_file,function(exists){
	if(exists){
		res.sendFile(path.resolve(path_file));

	}else{
		res.status(404).send({message:'No existe la cancion'});
	}
});
}






module.exports = {
	saveSong,
	getSong,
	getSongs,
	updateSong,
	deleteSong,
	getSongFile,
	uploadFile

	

}