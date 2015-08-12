var config = require('./config');
var userLog = config.userLog;
var requestHandler = require('./requestHandler');
var mysql = require('mysql');
var body_parser = require('body-parser');
var methodOverride = require('method-override');
var async = require('async');
var client = config.client;
var cnf = config.cnf;

//var start = 2012;
//var end = 2028;

//var day_s = 225;
//var day_e = 140;

var workHourS = 9;
var workHourE = 17;

var firstnames = ["Август","Аврор","Альберт","Анатолий","Борис","Богдан","Вадим","Валентин","Валерий","Василий","Влад","Владимир","Владислав","Вячеслав","Гарри","Геннадий","Георгий","Даниил","Денис","Евгений"];
var lastnames = ["Смирнов","Васильев","Иванов","Петров","Соколов","Яковлев","Андреев","Лебедев","Степанов","Семёнов","Николаев","Павлов","Дмитриев","Волков","Тимофеев","Афанасьев","Сергеев","Виноградов","Кузьмин","Герасимов","Марков","Новиков","Морозов","Романов","Осипов","Макаров"];
var middlenames = ["Александрович","Адамович","Анатольевич","Аркадьевич","Алексеевич","Андреевич","Артемович","Альбертович","Антонович","Богданович","Вадимович","Владимирович","Валентинович","Вячеславович","Викторович","Геннадиевич","Георгиевич","Геннадьевич","Григорьевич","Давидович","Денисович","Данилович","Дмитриевич","Евгеньевич","Егорович","Ефимович","Иванович","Ильич","Игоревич","Кириллович","Максович","Матвеевич","Натанович","Николаевич"];
/*
var firstnames = ["Альберт","Анатолий"];
var lastnames = ["sdf","sdf"];
var middlenames = ["rewfrew","refref"];*/
function GetRandomName()
{
	return [firstnames[getRandomArbitary(0,firstnames.length)],lastnames[getRandomArbitary(0,lastnames.length)],middlenames[getRandomArbitary(0,middlenames.length)]];
}

function getRandomArbitary(min, max)
{
  return Math.random() * (max - min) + min | 0;
}
function AddStudent(univer)
{
	var name = GetRandomName();
	sql = "INSERT INTO students SET Firstname='"+name[0]+"', Lastname='"+name[1]+"', Middlename='"+name[2]+"', Cource='2', Type='очная', Parent='"+univer+"', Phone='25343454', Passport='34538457978', Sex=1, BirthDate='2.02.1996', Address='Симферополь', Avatar='/user_images/default_male.png'";
	//userLog(sql);
	client.query(sql);
}
function ExpelStudent(id)
{
	sql = "UPDATE FROM `students` SET `Status` = 1 WHERE `Id`=" + id;
	client.query(sql);
}
function ChangeFormOfStudy(id)
{
	//
}

// ConvertDateToDays(1,2,year);
// 192.168.2.74:8888/api/emulation?day_start_comp=20&month_start_comp=8&day_end_comp=30&month_end_comp=8&year=2015
function Start(data, callback)
{
	var StudentResult;
	var start_compain = new Date(data.startCompain); // начало вступительной кампании
	var end_compain = new Date(data.endCompain); // окончание
	var start_emulation = new Date(data.start); // начало эмуляции
	var end_emulation = new Date(data.end); // конец эмуляции
	
	//userLog(" {"+start_emulation+"} {"+end_emulation+"}");
	
	function emulate_day_for_minutes(date,elemOfRes){
		var add_students_number = 0;
		if(date.getMonth() >= start_compain.getMonth() && date.getMonth()<end_compain.getMonth()){
			add_students_number = getRandomArbitary(0,2);
			for(var uni = 0; uni<add_students_number; uni++){
				AddStudent(1);
			}
		}
		return add_students_number;
	}
	
	//function 
	function emulate_day_for_hours(date,elemOfRes){
		var statistic = {add_students_number:0,expel_students_number:0}
		for(hour = workHourS; hour<workHourE; hour++){
								statistic.add_students_number += emulate_day_for_minutes(date,elemOfRes);
								if(getRandomArbitary(1,100)==3){
									ExpelStudent(elemOfRes.Id);
									statistic.expel_students_number++;
								}
							}
		return statistic;
	}
	
	async.series([
		function(cBack){
			requestHandler.requestDBGet("Student", -1, function(err, result){
				StudentResult = result;
				cBack(err);
			});
		},
		//function(cBack){
		//	setTimeout(function(){
		//		cBack();
		//	},0); 
		//},
		function(cBack){
			var msgArr = {}
			var add_students_number = 0;
			var expel_students_number = 0;
			var temp = {};
			async.eachSeries(StudentResult, function(elemOfRes, cBack){
					if(true){
						for(var date = start_emulation; date<end_emulation; date.setDate(date.getDate()+1)){
							temp = emulate_day_for_hours(date,elemOfRes); 
							add_students_number += temp.add_students_number;
							expel_students_number += temp.expel_students_number;
						}
					}
					msgArr = {currentDate:start_emulation,new_students_number:add_students_number,expel_students_number:expel_students_number,largest_number_of_incoming:getRandomArbitary(0,3)};
					setImmediate(function(){
						cBack();
					});
				},
				function done(){
					//userLog("-------------------------------------------------");
					callback(null,JSON.stringify(msgArr));
				});
			}/*,
		function(err){
			cBack(err);
		}*/
	]);
}
exports.Start = Start;