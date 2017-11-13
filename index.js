'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = process.env.PORT || 3001
const  app = require('./app')




mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/proyectofl',{useMongoClient: true},(err,res) => {
	if (err){
		return console.log(`error al conectar a la base de datos: ${err}` )
	}
	console.log('conexion establecida a mongo db exito....')

	app.listen(port,() => {
	console.log('API REST FUNCIONANDO Y CORRIENDO EL PUERTO:'+port)
})
})







