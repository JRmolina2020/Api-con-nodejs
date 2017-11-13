'use strict'

var express = require('express');
var AlbumController = require('../controllers/albums');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/album/'});

//ruta  de  un solo album especifico
api.get('/album/:id',md_auth.ensureAuth , AlbumController.getAlbum);

//ruta  de  todos los albunes
api.get('/albums/:page?',md_auth.ensureAuth , AlbumController.getAlbums);

//ruta save  de album
api.post('/album',md_auth.ensureAuth , AlbumController.saveAlbum);

// ruta update albumnes

api.put('/album/:id',md_auth.ensureAuth,AlbumController.updateAlbum);

// rute delete albumn

api.delete('/album/:id',md_auth.ensureAuth,AlbumController.DeleteAlbum);

//image de albumn
api.post('/upload-image-album/:id',[md_auth.ensureAuth,md_upload],AlbumController.uploadImage);
api.get('/get-image-album/:imageFile',AlbumController.getImageFile);

module.exports = api;