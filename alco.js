// мир ------------------------------------------------------------------------------------
function World (name) {
	var new_world = {
		name: name,
		bars: [],
		alcobots: [],
		CreateBar: function (name) {
			var bar = new Bar(name);
			bar.world = new_world;
			new_world.bars.push(bar);
			bar.init();
			menu.onchange = function () {
				bar.ChangePrice ();
			};
			return bar;
		},
		CreateCharacter: function (name, photo) {
			var character = new Character(name, photo);
			character.world = new_world;
			new_world.alcobots.push(character);
			character.init();
			return character;
		},
	}
	return new_world;
};

// Бары ----------------------------------------------------------------------------------
function Bar(name) {
	this.name = name;
	this.beer_price = 1;
	this.beer_price = 1;
	this.vodka_price = 3;
	this.ersh_price = 4;
	this.lemon_price = 1;
	this.balance = 0;
	this.totaldrink = null;
	this.dom = {
		cell: null,
		stat: null
	};
	this.map;
	this.world = null; // ссылка на world
	return this;
};

Bar.prototype = {
  Payments: function() {
	if (this.world.bars[0].totaldrink <= 0) {
	  this.world.bars[0].totaldrink = 0;
	} else {
	  this.world.bars[0].totaldrink = 0;
	  this.world.bars[0].balance = Math.round(this.world.bars[0].balance - this.world.bars[0].balance * 0.4 - 10);
	  $('<p><b> Бар оплатил. Баланс бара: ' + this.world.bars[0].balance + '$.</b></p>').appendTo('.logs-log');
	}
  },
  tick: function() {
	//платежи бара
	this.Payments();
	$('#balancetext').text('Баланс бара : ' + this.world.bars[0].balance + '$');
  },
// Меняет цены бара на введенные в Input
  ChangePrice: function (){
	this.world.bars[0].beer_price = parseInt($("#beer_menu").val());
	this.world.bars[0].vodka_price = parseInt($("#vodka_menu").val());
	this.world.bars[0].ersh_price = parseInt($("#ersh_menu").val());
	this.world.bars[0].lemon_price = parseInt($("#lemon_menu").val());
  },
  map: function() {
  	var self = this.map;
  	ymaps.ready(function (self){
		self.map = new ymaps.Map('YMapsID', {
			center: [54.986, 82.89285623],
			zoom: 11
		});
		var myRectangle = new ymaps.GeoObject({
		    geometry: {
		        type: "Rectangle",
		        coordinates: [[55.00, 82.80],[54.90, 83.00]]
		    }
		});
		self.map.geoObjects.add(myRectangle);
	});
  },
  init: function() {
	//устанавливает значения по умолчанию полям input
	$('#beer_menu').val(this.world.bars[0].beer_price);
	$('#vodka_menu').val(this.world.bars[0].vodka_price);
	$('#ersh_menu').val(this.world.bars[0].ersh_price);
	$('#lemon_menu').val(this.world.bars[0].lemon_price);
	// 
	this.dom.cell = $('<div class="bar-name"><p>' + this.name + '</p></div> <div class="barcell" id="balancetext"></div>').appendTo('.bar-log');
	
	this.map();

	var self = this;
	var circle = function() {
	  self.tick();
	  setTimeout(function() {
		circle();
	  }, 10000);
	};
	circle();
  }
};
// Алкоботы -----------------------------------------------------------------------------
function Character(name, photo) {
  this.name = name;
  this.photo = photo;
  this.log = [];
  this.counts = {
  bottles: 0,
	bottles_beer: 0,
	bottles_vodka: 0,
	bottles_ersh: 0,
	money: 20,
	money_total: 0
  };
  this.earn = 10;
  this.spent = null;
  this.dom = {
	cell: null
  };
  this.world = null; // ссылка на world
  return this;
};
Character.prototype = {
  name: 'безымянный',
//записать логи
  Log: function(message, type) {
	this.log.push({
	  message: message,
	  type: type
	});
	// console[type](message); выводит логи с датой в консоль
	var date  = new Date();

	var month = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"];
	
	var time =date.getDate()+' ' + month[date.getMonth()] +' ' + date.getFullYear()+'г. ' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds() + ' -';
	
	$('<p>' + time + ' ' + message + '</p>').appendTo('.logs-log');
	$('.logs-log').scrollTop(999999);
  },
  //получает историю
  GetHistory: function() {
	this.log.forEach(function(elem) {
	  console[elem.type](elem.message);
	});
  },
  //выпивалка
  Drink: function(B) {
	var menuselect = Math.ceil(Math.random() * 41);
	if (this.counts.bottles <= 9 && menuselect <= 20 && this.counts.money >= (this.world.bars[0].beer_price * B)) { // выпьет пива
	  this.counts.bottles += B;
	  this.counts.bottles_beer += B;
	  this.counts.money = this.counts.money - this.world.bars[0].beer_price * B;
	  
	  this.Log(this.name + ' выпил ' + this.counts.bottles + ' бутылки пива за ' + this.world.bars[0].beer_price + '$.' + ' У него осталось ' + this.counts.money + '$.', 'info');
	  this.dom.cell.attr('data-is', 'drink');
	  
	  this.world.bars[0].totaldrink = this.world.bars[0].totaldrink + B;
	  this.world.bars[0].balance = this.world.bars[0].balance + this.world.bars[0].beer_price * B;
	  this.dom.stat.find('#beer').text(this.counts.bottles_beer);
	
	} else if (this.counts.bottles <= 9 && menuselect <= 30 && menuselect > 20 && this.counts.money >= (this.world.bars[0].vodka_price * B + this.world.bars[0].lemon_price)) { // выпьет водки и закусит лимоном
	  this.counts.bottles += B;
	  this.counts.bottles_vodka += B;
	  this.counts.money = this.counts.money - this.world.bars[0].vodka_price * B - this.world.bars[0].lemon_price;
	  
	  this.Log(this.name + ' выпил ' + this.counts.bottles + ' бутылок водки за ' + this.world.bars[0].vodka_price + '$.' + ' У него осталось ' + this.counts.money + '$.', 'info');
	  this.dom.cell.attr('data-is', 'drink');
	  
	  this.world.bars[0].totaldrink = this.world.bars[0].totaldrink + B;
	  this.world.bars[0].balance = (this.world.bars[0].balance + (this.world.bars[0].vodka_price * B)) + this.world.bars[0].lemon_price;
	  this.dom.stat.find('#vodka').text(this.counts.bottles_vodka);
	
	} else if (this.counts.bottles <= 9 && menuselect >= 30 && this.counts.money >= (this.world.bars[0].ersh_price * B)) { // выпьет ерша
	  this.counts.bottles += B;
	  this.counts.bottles_ersh += B;
	  this.counts.money = this.counts.money - this.world.bars[0].ersh_price * B;
	  
	  this.Log(this.name +' выпил ' + this.counts.bottles + ' ерша за ' + this.world.bars[0].ersh_price + '$.' + ' У него осталось ' + this.counts.money + '$.', 'info');
	  this.dom.cell.attr('data-is', 'drink');
	  
	  this.world.bars[0].totaldrink = this.world.bars[0].totaldrink + B;
	  this.world.bars[0].balance = this.world.bars[0].balance + this.world.bars[0].ersh_price * B;
	  this.dom.stat.find('#ersh').text(this.counts.bottles_ersh);
	
	} else {
	  this.counts.bottles = 0;
	  
	  this.Log(this.name + ' не может пить больше.', 'error');
	  
	  this.dom.cell.attr('data-is', 'sleep');
	};
	
	this.dom.stat.find('#money').text(this.counts.money);

  },
  //работа
  Work: function() {
	if (this.counts.money <= this.world.bars[0].beer_price) {
	  var workdays = Math.ceil(Math.random() * 7);
	  
	  this.counts.money = this.counts.money + workdays * this.earn;
	  this.counts.money_total += this.counts.money;
	  this.counts.bottles = 0;
	  
	  this.Log( this.name + ' пошел поработать за ' + this.earn + '$ в день. У него есть ' + this.counts.money + '$.', 'error')
	  this.dom.cell.attr('data-is', 'work');
	  
	  this.dom.stat.find('#money').text(this.counts.money);
	  this.dom.stat.find('#money_total').text(this.counts.money_total);

	}
  },
  // вывод персонажа на карту
  toMap: function () {
  	var self = this.world.bars[0].map;
  	var name_ = this.name;
  	ymaps.ready(function (self){

  		var x = Math.round(Math.random()*9)
  		var y = Math.round(100 - Math.random()*19)

	  	myPlacemark = new ymaps.Placemark(['54.9' + x, '82.' + y], {
			hintContent: name_,
			balloonContent: 'Бухаю! Не подглядывай!'
		});
		self.map.geoObjects.add(myPlacemark);
	})
  },
  // Выбор действия "пить или работать" персонажа Alcobot-i
  tick: function() {
	var rand = Math.ceil(Math.random() * 100);
	var B = Math.ceil(Math.random() * 5);
	if (rand >= 75) {
	  this.Drink(B);
	} else {
	  this.Work();
	}
  },
  init: function() {
	this.dom.cell = $('<div class="cell"><img class="bot-avatar" src="' + this.photo + '" width="48" height="48" hspace="0"></div>').appendTo('.table-vis'); //нарисует таблицу визуализации.
	this.dom.stat = $('<div class="stat-bot"><img class="bot-img" src="'+ '' + this.photo + '' +'" alt="no photo"><br><b>' + this.name + '</b><br>Выпито пива: <span id="beer">' + this.counts.bottles_beer + '.</span><br>Выпито водки: <span id="vodka">' + this.counts.bottles_vodka + '.</span><br>Выпито "Ершей": <span id="ersh">' + this.counts.bottles_ersh + '</span><br>' +' В кармане <span id="money"> ' + this.counts.money + '</span>$.<br>Заработано всего: <span id="money_total">' + this.counts.money_total + '$.</span></div>').appendTo('.stats-stat');//нарисует окно статистики бота
	this.toMap();
	function rand(min, max) { // Функция рандома для запуска цикла жизни.
	  var i = 0;
	  while (i < min) {
		i = Math.ceil(Math.random() * max);
	  }
	  return i;
	};
	var self = this;
	var circle = function() {
	  self.tick();
	  setTimeout(function() {
		circle();
	  }, rand(500, 1000));
	};
	circle();
  },
};

$(document).on('ready', function() {
	//модальное окно
	event.preventDefault();
		$('#overlay').fadeIn(400,
		 	function(){ 
				$('#modal_form') 
					.css('display', 'block') 
					.animate({opacity: 1, top: '50%'}, 350); 
		});
	// Зaкрытие мoдaльнoгo oкнa, тут тo же сaмoе нo в oбрaтнoм пoрядке
	$('#modal_close, #overlay,#btn').click( function(){ 
		$('#modal_form')
		.animate({opacity: 0, top: '45%'}, 350, 
			function(){ 
				$(this).css('display', 'none'); 
				$('#overlay').fadeOut(400); 
			}
		);

		//создание мира, бара, персонажей
		var world = new World ('Мир');
		world.CreateBar('Бар "Бухарест"');
		function GetName (names) {
			var id = Math.round(Math.random()*372002700); // 372002700 пользователей вконтакте на 29.06.16г.
		  $.ajax({
				url: 'https://api.vk.com/method/users.get?uid='+id+'&fields=photo_50',
				method: 'GET',
				dataType: 'JSONP',
				success: function (data){
					setTimeout(function (){
						if (data.response[0].deactivated) {
							GetName(names);
						} else {
						name = data.response[0].first_name + ' ' + data.response[0].last_name;
						photo = data.response[0].photo_50;
						world.CreateCharacter(name, photo);
						}
					}, 100);
				}
			});
		};
		for (var i = 1; i <= 32; i++) {
			GetName([]);
		};
	});
});	