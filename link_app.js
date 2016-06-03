var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var Hashids = require('hashids'),
	hashids = new Hashids("jambalaya", 7);


var app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
	res.render('index');
});

app.post('/links', function(req, res){
	db.link.
	findOrCreate({where: { url: req.body.link}, defaults: {count: 0}})
	.spread(function(link, created){
		res.redirect('/links/' + link.id);
	})
});

app.get('/links', function(req, res){
	db.link.findAll({order: 'count DESC',
						limit: 10}).
	then(function(list){
		var hashList = [];
		list.forEach(function(item){
			hashList.push(hashids.encode(item.id));
		});
		res.render('links', {list: list,
								hashList: hashList});
	});
});

app.get('/links/:id', function(req, res){
	var linkId = parseInt(req.params.id);
	var hash = hashids.encode(linkId);
	db.link.find({where: {id: linkId}})
	.then(function(link){
		var clicks = link.count;
		res.render('show', {hash: hash,
							clicks: clicks});
	});
});

app.get('/:hash', function(req, res){
	var hash = req.params.hash;
	var id = hashids.decode(hash);
	db.link.find({where: {id: id}})
	.then(function(link){
		var newCount = link.count + 1;
		link.updateAttributes({
			count: newCount
		})
		res.redirect(link.url);
	})
});



app.listen(process.env.PORT || 3000);