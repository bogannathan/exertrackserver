let router = require('express').Router()
let sequelize = require('../db.js')
let User = sequelize.import('../models/user')
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')

router.post('/', function(req, res) {
	// when we post to api user, it will want a user object in the body
	let username = req.body.user.username
	let pass = req.body.user.password 
	let fullname = req.body.user.fullname
	let summary = req.body.user.summary
	let age = req.body.user.age
	let gender = req.body.user.gender
	
	console.log("user")
	//need to create a user object and use sequelize to put that user into our database
	//needs to match the model above (the username password)
	User.create({
		username: username,
		passwordhash: bcrypt.hashSync(pass, 10),
		fullname: fullname,
		summary: summary,
		age: age,
		gender: gender
	}).then(
			//sequelize is going to return the object it created from db
		function createSuccess(user){
			let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: 60*20})
			res.json({
				user: user,
				message: 'create',
				sessionToken: token
			})	
			console.log('create success')	
		},
		function createError(err){
			res.send(500, err.message)
		}
	)
})

router.get('/', function(req, res) {
	//user variable
	let userid = req.user.id
	User
		.findAll({
			where: {owner: userid}
		})
		.then(
			//success
			function findAllSuccess(data) {
				//console.log(data)
				res.json(data)
			},
			//failure
			function findAllError(err) {
				res.send(500, err.message)
			}
		)
})

router.put('/', function(req, res) {
	let username = req.body.user.username
	let pass = req.body.user.password 
	let fullname = req.body.user.fullname
	let data = req.body.user.id
	let summary = req.body.user.summary
	let age = req.body.user.age
	let gender = req.body.user.gender

	console.log("user test")
	User
		.update(
		{
			username: username,
			passwordhash: bcrypt.hashSync(pass, 10),
			fullname: fullname,
			summary: summary,
			age: age,
			gender: gender	
		},
		{where: {id: data}}
		).then(
		function updateSuccess(updatedPassword) {
			res.json(updatedPassword)
		},

		function updateError(err) {
			res.send(400, err.message)
		}
	)
})

module.exports = router;
