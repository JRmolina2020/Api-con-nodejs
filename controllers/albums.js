'use strict'

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');




//un solo album
function getAlbum(req,res){
var albumId = req.params.id;
Album.findById(albumId,(err,album) => {
	if(err){
		res.status(500).send({message:'Error en la peticion'});
	}else{
		if(!album){
			res.status(404).send({message:'El album no existe'});
		}else{
			res.status(200).send({album});
		}
	}
});
}


//varios albunes

function getAlbums(req,res){
if (req.params.page) {
var page = req.params.page;
}else{
var page =1;
}
var itemsPerPage = 3;

Album.find().sort('title').paginate(page,itemsPerPage,function(err,album,total){

if(err){
	res.status(500).send({message:'error en la peticion'});
}else{

if (!album){
	res.status(404).send({message:'no hay albunes registrados'});
}else{
return res.status(200).send({
pages: total,
album: album
});
}
}
});
}



function saveAlbum(req,res){
	var album = new Album();
	//recogemos los paramentros que llegan por post y asigamos los valores
	var params = req.body;

	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err,albumStored) => {
     if(err){
     	res.status(500).send({message: 'Error al guardar el album'});
     }else{
     	if(!albumStored){
     	res.status(404).send({message: 'El album no ha sido guardado'});	
     	}else{
     		res.status(200).send({album: albumStored});
     	}
     }

	});
}

//modificar album
function updateAlbum(req,res){
var albumId = req.params.id;
var update = req.body;

Album.findByIdAndUpdate(albumId,update,(err,albumUpdated) =>{
if(err){
res.status(500).send({message: 'Error al editar  el album'});	
}else{
	if(!albumUpdated){
		res.status(404).send({message: 'El album no ha sido actualizado'});	
	}else{
		res.status(200).send({album: albumUpdated});	
	}
}	
});
}





function DeleteAlbum(req,res){
var albumId = req.params.id;

        //que se lleve todo lo que tenga albums y canciones
        Album.findByIdAndRemove(albumId,(err,albumRemoved) => {
       if(err){
         res.status(500).send({message: 'Error al eliminar el album'});		
         }else{
	     if(!albumRemoved){
	     	res.status(404).send({message: 'el album no ha sido eliminado'});	
	       }else{

	     Song.find({album: albumRemoved._id}).remove((err,songRemoved)=>{
         if(err){
         res.status(500).send({message: 'Error al eliminar la cancion'});		
         }else{
	     if(!songRemoved){
	     	res.status(404).send({message: 'la cancion no ha sido eliminada'});	
	        }else{
            res.status(200).send({album: albumRemoved});	
	        }

        }
    });
	}
}
});
 }

//subir imagen del album
function uploadImage(req,res){
var albumId = req.params.id;
var  file_name = 'No subido...';

if(req.files){
var file_path = req.files.image.path;
var file_split = file_path.split('\\');
var file_name =file_split[2];
var ext_split = file_name.split('\.');
var file_ext = ext_split[1];

if(file_ext =='png' || file_ext =='jpg' || file_ext == 'gif'){

Album.findByIdAndUpdate(albumId,{image: file_name}, (err,albumUpdated) => {
if(!albumUpdated){
res.status(404).send({message:'no se ha podido actualizar el albums'});	
}else{
res.status(200).send({album: albumUpdated});	
}	
});

}else{
res.status(200).send({message: 'extension no valida'});	
}
}else{
res.status(200).send({message: 'no has subido ninguna imagen'});

}
}

//recuperar la imagen
function getImageFile(req,res){

var imageFile = req.params.imageFile;
var path_file ='./uploads/album/'+imageFile;
fs.exists(path_file,function(exists){
	if(exists){
		res.sendFile(path.resolve(path_file));

	}else{
		res.status(404).send({message:'No existe la imagen'});
	}
});
}





module.exports = {
	saveAlbum,
	getAlbum,
	getAlbums,
	updateAlbum,
	uploadImage,
	 getImageFile,
	 DeleteAlbum

}