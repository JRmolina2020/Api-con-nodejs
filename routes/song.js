'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/song/'});


//ruta save  de album
api.post('/song',md_auth.ensureAuth , SongController.saveSong);
//ruta  de  una sola cancion especifica
api.get('/song/:id',md_auth.ensureAuth , SongController.getSong);
//ruta  de  todas  las canciones
api.get('/songs/:page?',md_auth.ensureAuth , SongController.getSongs);

// ruta update song
api.put('/song/:id',md_auth.ensureAuth,SongController.updateSong);

//eliminar una cancion
api.delete('/song/:id',md_auth.ensureAuth,SongController.deleteSong);
//song
api.post('/upload-file-song/:id',[md_auth.ensureAuth,md_upload],SongController.uploadFile);
api.get('/get-song-file/:songFile',SongController.getSongFile);


module.exports = api;