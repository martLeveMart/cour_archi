/**
 * Created by mleveque on 25/10/2018.
 */
if(typeof proj === 'undefined')
	proj = {};

function changeCo(){
	var titre = $('header p.connexion');
	var bloc = $('div#connexion div#bloc div#fin');
	var button = $('div#connexion div#bloc div#fin div.button');
	var lien = $('div#connexion div#bloc div#fin a');
	const mode = bloc[0].className;
	$('span#errorCo').hide();
	if(mode === "Connexion"){
		bloc.removeClass("Connexion");
		lien.text("Ce connecter");
		button.text("Inscription");
		titre.text("Créer un compte");
	}else{
		bloc.addClass("Connexion");
		lien.text("Créer un compte");
		button.text("Connexion");
		titre.text("Connexion");
	}
}

function Validation(){
	var bloc = $('div#connexion div#bloc div#fin');
	const mode = bloc[0].className;
	const login = $('input[name=identifiant]').val();
	const password = $('input[name=password]').val();
	if(login.length && password.length) {
		if (mode === "Connexion") {
			proj.login = login;
			proj.password = password;
			$.ajax({
				url: "http://92.222.69.104:80/todo/listes",
				headers:{"login": login, "password": password},
				type: "GET"
			}).done(function (data) {
					proj.data = data;
					Connexion(data);
				})
				.fail(function (error) {
					$('span#errorCo').show();
				})
		} else {
			$.ajax({
				url: "http://92.222.69.104:80/todo/create/" + login + "/" + password
			}).done(function (data) {
					var content = $('<div id="contentPopup">');
					var partieUn = $('<span>Votre compte a était créer avec succès</span>');
					var partieTrois = $('<div>');
					var OK = $('<div class="button">OK</div>');

					OK.on('click', (event) => {
						$('div#screen').remove();
						$('div#popup').remove();
					});

					partieTrois.css({
						display: 'flex',
						'justify-content': 'center',
						'align-items': 'center'
					});
					content.append(partieUn).append(partieTrois);
					partieTrois.append(OK);
					makePopup(content, "Compte créer");
					$('div#connexion div#bloc div#fin a').click();
				})
				.fail(function (error) {
					console.log(error)
				})
		}
	}else{
		$('span#errorCo').show();
	}
}

function Deco(){
	$('div.noteTitle').remove();
	$('header p.connexion').show();
	$('header div.proj').hide();
	$('header div.proj div#info').html('Bonjour, <br>' + proj.login);
	$('div.ecran').show();
	$('div#projet').hide();
}

function Connexion(data){
	$('header p.connexion').hide();
	$('header div.proj').show();
	$('header div.proj div#info').html('Bonjour, <br>' + proj.login);
	$('div.ecran').hide();
	$('div#projet').show();
	for(var i = 0; i < proj.data.todoListes.length; i++){
		const blocId = proj.data.todoListes[i].name;
		var bloc = createNote(proj.data.todoListes[i], blocId);
		$('#todoListe').append(bloc);
	}
	$('img.addNote').unbind('click');
	$('img.addNote').on('click', (event) => {
		var content = $('<div id="contentPopup">');
		var partieUn = $('<span>Nom de la nouvelle note:</span>');
		var partieDeux = $('<input id="valNote">').css({
			'max-width': '200px'
		});
		var error = $('<span>Une de vos notes possède déjà ce noms</span>').css({
			display: 'none',
			color: 'red'
		})
		var partieTrois = $('<div>');
		var OK = $('<div class="button">OK</div>');
		var Close = $('<div class="button">Annuler</div>');

		Close.on('click', (event) => {
			$('div#screen').remove();
			$('div#popup').remove();
		});
		OK.on('click', (event) => {
			const blocId = partieDeux.val();
			if($('div#' + blocId).length){
				error.show();
			}else{
				var data = {name:partieDeux.val(),elements:[]};
				proj.data.todoListes.push(data);
				var bloc = createNote(data, blocId);
				$('#todoListe').append(bloc);
				$('div#screen').remove();
				$('div#popup').remove();
				$(bloc).click();
				sendData();
			}
		});

		partieTrois.css({
			display: 'flex',
			'justify-content': 'space-between',
			'align-items': 'center'
		});
		content.append(partieUn).append(partieDeux).append(error).append(partieTrois);
		partieTrois.append(OK).append(Close);
		makePopup(content, "Ajout d'une Note");
	});
	$('img.addTache').unbind('click');
	$('img.addTache').on('click', (event) => {
		var newTache = $('<li class="element">').text('Nouvelle Tache');
		$('ul#liste').append(newTache);
		modifNoteListe();
		$('li').attr('contenteditable',true).on('blur', (event) => {
			modifNoteListe();
		});
	});
	$('img.supprNote').unbind('click');
	$('img.supprNote').on('click', (event) => {
		var content = $('<div id="contentPopup">');
		var classe = $("div#headerNote span#titre")[0].className;
		var partieUn = $('<span>Voulez vous vraiment supprimez la note '+classe+'?</span>');
		var partieTrois = $('<div>');
		var OK = $('<div class="button">OK</div>');
		var Close = $('<div class="button">Annuler</div>');

		Close.on('click', (event) => {
			$('div#screen').remove();
			$('div#popup').remove();
		});
		OK.on('click', (event) => {
			for(var i = 0; i < proj.data.todoListes.length; i++){
				if(proj.data.todoListes[i].name === classe){
					$('div[name="' + proj.data.todoListes[i].name +'"').remove();
					proj.data.todoListes.splice(i,1);
					break;
				}
			}
			$('div.noteTitle')[0].click();
			$('div#screen').remove();
			$('div#popup').remove();
			sendData();
		});

		partieTrois.css({
			display: 'flex',
			'justify-content': 'space-between',
			'align-items': 'center'
		});
		content.append(partieUn).append(partieTrois);
		partieTrois.append(OK).append(Close);
		makePopup(content, "Suppression Note");
	});
	$('div.noteTitle')[0].click();
}

function createNote(data,id){
	var bloc = $('<div name="'+ id +'">').addClass('noteTitle');
	var titre = $('<span>').text(data.name);
	var fleche = $('<span>').text('\u27a4');
	bloc.append(titre).append(fleche);
	bloc.on('click', (e) => {
		$("div#headerNote span#titre").text(data.name).removeClass().addClass(data.name);
		$('li.element').remove();
		for(let element of data.elements){
			var el = $('<li class="element">').text(element);
			$("div#contentNote ul#liste").append(el);
		}
		$('li').attr('contenteditable',true).on('blur', (event) => {
			modifNoteListe();
		});
	});
	return bloc;
}

function makePopup(contenu,titre){
	var screen = $('<div id="screen">').css({
		position: 'absolute',
		'z-index': 1000,
		'background-color' : 'rgba(0, 0, 0, 0.5)',
		top: '0px',
		left: '0px',
		width: $('body').width()+'px',
		height: $('body').height()+'px'
	});
	var popup = $('<div id="popup">');
	var title = $('<div id="titlePopup">'+titre+'</div>');
	var content = $('<div>');

	popup.append(title).append(content);
	content.append(contenu);

	$('body').append(screen).append(popup);
	popup.css({
		position: 'absolute',
		'z-index': 1001,
		left: ($('body').width()/2 -(popup.width()/2))+'px',
		top: ($('body').height()/2 -(popup.height()/2))+'px'
	});
}

function modifNoteListe (){
	var classe = $("div#headerNote span#titre")[0].className;
	var liste = $('ul#liste')[0].children;
	var modif = [];
	for(let child of liste){
		modif.push(child.textContent);
	}
	for(var i = 0; i < proj.data.todoListes.length; i++){
		if(proj.data.todoListes[i].name === classe){
			proj.data.todoListes[i].elements = modif;
		}
	}
	sendData();
}

function sendData(){
	$.ajax({
		type: "post",
		data:JSON.stringify(proj.data),
		contentType: "application/json; charset=utf-8",
		url: "http://92.222.69.104:80/todo/listes"
	}).done(function (data) {
			console.log(data);
		})
		.fail(function (error) {
			console.log("Problème à l'envoie");
		})
}