'use strict'


var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/artist/'});


//ruta  de  un solo artista en especifico 
api.get('/artist/:id',md_auth.ensureAuth , ArtistController.getArtist);
//ruta  de  todos los artistas
api.get('/artist/:page?',md_auth.ensureAuth , ArtistController.getArtists);

//ruta save  de artista
api.post('/artist',md_auth.ensureAuth , ArtistController.saveArtist);

// ruta update artista
api.put('/artist/:id',md_auth.ensureAuth,ArtistController.updateArtist);

//eliminar un artista
api.delete('/artist/:id',md_auth.ensureAuth,ArtistController.DeleteArtist);

//image
api.post('/upload-image-artist/:id',[md_auth.ensureAuth,md_upload],ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile',ArtistController.getImageFile);

module.exports = api;