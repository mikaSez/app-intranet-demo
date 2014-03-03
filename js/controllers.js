'use strict';

/* Controllers */

var app = angular.module('hitemaApp.controllers', []);

app.controller('UserController', function($scope, UserFactory) {
		function init(){
		UserFactory.getUsers().success(function(data){

			$scope.users = data;
		})
	};
	init();

});

app.controller('AccueilController', function($scope, UserFactory, HelpFactory, $routeParams){
	function init(){
		var users;
		 UserFactory.getUsers().success(function(data){
			users = data;
			keepInit(users);
		});

	};
	function keepInit(users){
		var currentUser = users[$routeParams.id-1];
		if(currentUser.type ==="tuteur"){
			$scope.eleves = [];
			for (var i = currentUser.eleves.length - 1; i >= 0; i--) {
				$scope.eleves.push(users[currentUser.eleves[i].id-1]);
			};
		}
		UserFactory.setCurrentUser(currentUser);
		$scope.user = currentUser;
		$scope.permissions = {
	         showAdmin: currentUser.type === "prof",
	         showBasic: (currentUser != undefined),
	         showHelp: currentUser.type !== "tuteur" 
    	 };

    	 if($scope.permissions.showHelp){
    	 	loadBasicHelp();
    	 };

    	 UserFactory.setUserPermissions($scope.permissions);
	};

	function loadBasicHelp(){
		HelpFactory.getHelps().success(function(data){
			$scope.helps = data;
		});
	};

	init();
});


app.controller('StaffController', function($scope, UserFactory){
	function init(){
		 UserFactory.getStaff().success(function(data){
		 	$scope.staff = data;
		 });
	};
	init();
});


app.controller('ProfilController', function($scope, UserFactory, $routeParams){
	function init(){
	    UserFactory.getUser($routeParams.id, function(user){
	    	$scope.user= user;
	    	UserFactory.setCurrentUser(user);
	    });			
		} 
	$scope.changeName = function (name){
		UserFactory.updateUserName(name);
	}


	function keepInit(users ){
		var currentUser = users[$routeParams.id-1];
		UserFactory.setCurrentUser(currentUser);
		$scope.user = currentUser;
	};
	init();
});


app.controller('LostController', function($scope, UserFactory, AbsencesFactory ,  $routeParams){
	function init(){
		$scope.user=UserFactory.getCurrentUser($routeParams.id);
		if($scope.user == undefined){
		 	UserFactory.getUsers().success(function(data){
			var users = data;
			keepInit(users);
			});
			
		} else {
			initAbsences();
		}
	};

	function initAbsences(){
			AbsencesFactory.getAbsencesForUser($scope.user, function(absences){
				$scope.absences = absences;
			});
		};
	function keepInit(users ){
		var currentUser = users[$routeParams.id-1];
		UserFactory.setCurrentUser(currentUser);
		$scope.user = currentUser;
		initAbsences();
		
	};


	init();
});
	
app.controller('AddNewsController', function($scope,HelpFactory, $routeParams){

	$scope.addNews = function(news){
			news.autor = $routeParams.name;
			var today = new Date();
			var heure = today.getHours();
			var minutes = today.getMinutes();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			} 

			if(mm<10) {
			    mm='0'+mm
			} 

			today = heure + ':' + minutes + ' ' +  dd+'/'+mm+'/'+yyyy;
			news.date = today;
			HelpFactory.addHelp(news);
	}
});


app.controller('CreateUserController', function($scope, UserFactory){

	function init() {
		var user = {};
		user.type = 'prof';
		user.name= '';
		user.classe = 'Dev';
		$scope.user = user;
		$scope.creerUtilisateur = function(user, type){
			if(angular.isString(user.name) && user.name.length != 0){
				if(user.type !== 'eleve'){
					delete user.classe;
				}
				$scope.name = user.name;
				UserFactory.createUser(user);
				$scope.creationDone = true;

				init();
			}else {
				$scope.messageError = true;
			}

		}
	}

	init();

});


app.controller('ShowPlanningController', function($scope, $routeParams, PlanningFactory){
	function init(){
		console.log("planning de la classe : " + $routeParams.classe);
		$scope.classe = $routeParams.classe;
		PlanningFactory.getPlanningForClass($scope.classe, function(data){
			$scope.weeks = data;
		});
		
	}
	init();
});

app.controller('GestionPlannings', function($scope){
	function init(){
		$scope.clazzes = [{"id": 1, "name":"Dev"}, {"id":2, "name":"Physique"}];
	}
	init();
})

app.controller('GestionPlanning', function($scope, $routeParams, PlanningFactory){
	function init(){
		console.log("planning de la classe : " + $routeParams.classe);
		$scope.classe = $routeParams.classe;
		PlanningFactory.getPlanningForClass($scope.classe, function(data){
			$scope.weeks = data;
		});


		$scope.updatePlanning = function(planning){
			PlanningFactory.updatePlanning(planning);
		}
	}
	init();
});

app.controller('GestionEleveController', function($scope, UserFactory){
	function init(){
		UserFactory.getEleves(function(data){
			$scope.eleves = data;
		});
	};
	init();
});
 
app.controller('GestionAbsencesController', function($scope, $routeParams, UserFactory, AbsencesFactory){
	function init(){
		$scope.absence = {};
		$scope.absence.juste = false;
		$scope.ajouterAbsence = function(absence){
			absence.fk_id=$scope.user.id;
			AbsencesFactory.addAbsence(absence, function() {
				init();
			});
		}


		$scope.supprimerAbsence = function(absence){
			AbsencesFactory.deleteAbsence(absence, function(){
				init();
			})
		}

		UserFactory.getUser($routeParams.id, function(user){
		console.log("gestion absences");
			$scope.user = user;
			AbsencesFactory.getAbsencesForUser(user, function(absences){
				$scope.absences = absences;
			});
		});
	};
	init();
});

 app.factory('AbsencesFactory', function($http){
 	var factory = {};
 	var absences;


 	factory.getAbsences = function(){
 		if(!absences){
			absences  = $http.get('data/absences.json');
 		}
 		return absences;
 	};
 	factory.deleteAbsence = function(absence, callback){
 		factory.getAbsences().success(function(data){
 			for (var i = data.length - 1; i >= 0; i--) {
 				if(parseInt(data[i].id) === parseInt(absence.id)){
 					data = data.splice(i, 1);
 					callback();
 				}
 			};
 			
 		})
 	}
 	factory.addAbsence = function(absence, callback){
 		var temp = angular.copy(absence);
 		factory.getAbsences().success(function(data){
 			temp.id = data.length+1;
 			data.push(temp);
 			callback();
 		})
 	}
 	factory.getAbsencesForUser = function(user, callback) {
 		var that = this;
 		var filter = function(user, callback){
	 		var filtredAbsences = [];
	 		user.totalAbsences = 0; 
	 		user.totalAbsencesJust  = 0;
	 		if(user.type==="eleve"){
	 			factory.getAbsences().success(function(data){
	 				for (var i = 0; i < data.length; i++) {
	 			 	if(user.id===data[i].fk_id){
	 			 		filtredAbsences.push(data[i]);
	 			 		
	 			 		user.totalAbsences += parseInt(data[i].nb_hours); 
	 			 		if(data[i].juste){
	 			 			user.totalAbsencesJust += parseInt(data[i].nb_hours); 
	 			 		}
	 			 	}
	 			 };
	 				callback(filtredAbsences);
	 			})
	 		}
 		}
 		factory.getAbsences().success(function(data){
 			filter(user, callback);
 		});

 	}
 
 	return factory;
 });
  app.factory('UserFactory', function($http){
		var factory = {};
		var users;
		var currentUser;
		var permissions;
		var staff;
		factory.getUsers = function(){
			if(!users){
				 console.log("had to get data");
				 users = $http.get('data/users.json');
			}
			return users;
		
		};

		factory.createUser = function(user){
			factory.getUsers().success(function(data){
				user.id = data.length+1; //we begin at 1 
                var temp = angular.copy(user); //we have to do a deep copy in order to avoid duplicata's on multiple consecutives pushes.
				data.push(temp);
				temp = undefined; //we have to kill the reference 
			})

		};


		factory.getEleves = function(callback){
			factory.getUsers().success(function(data){
				var temp = [];
				for (var i = data.length - 1; i >= 0; i--) {
					if(data[i].type==='eleve'){
						temp.push(data[i]);
					}
				};
				callback(temp);
			})
		};
		factory.setCurrentUser = function(user){
			currentUser = user;
		};
		factory.updateUserName = function(newName){
			currentUser.name=newName;
		};
		factory.getStaff = function(){
			if(!staff){
				console.log("had to reload the staff");
				staff  = $http.get('data/staff.json');
			}
			return staff;
		};

		factory.getUser = function(idUser, callback){
			factory.getUsers().success(function(data){
				for (var i = data.length - 1; i >= 0; i--) {
					if(parseInt(data[i].id) === parseInt(idUser)){
						callback(data[i]);
						return;
					}
				};
			})
		};


		factory.getCurrentUser = function(idUser){
				if(currentUser.id != idUser){
					//user changed
					return undefined;
				}
				return currentUser;
		};
		factory.setUserPermissions = function(userPermissions){
			permissions = userPermissions;
		};
		return factory;
});

app.factory('HelpFactory', function($http){
	var factory = {};
	var helps;

	factory.getHelps = function(){
		if(!helps){
			console.log("had to get help data");
			helps = $http.get('data/help.json');
		}
		return helps;
	};

	factory.addHelp = function(news){
		factory.getHelps().success(function(data){
			news.id = data.length + 1 ; //We begin at 1 
			var temp = angular.copy(news); //we have to do a deep copy in order to avoid duplicata's on multiple consecutives pushes.
			data.push(temp);
			temp = undefined; //we have to kill the reference 
		});
	};
	return factory;
});


app.factory('PlanningFactory', function($http){
	var factory = {};
	var plannings;

	factory.loadPlannings = function(){
		if(!plannings){
			console.log("had to load plannings from data store");
			plannings = $http.get('data/planning.json');
		}
		return plannings;
	};

	factory.updatePlanning = function(planning){
		factory.loadPlannings().success(function(data){
			for (var i = data.length - 1; i >= 0; i--) {
				if(parseInt(data[i].id) === parseInt(planning.id)) {
					data[i] = planning;
				}
			};
		});
	}

	factory.getPlanningForClass = function(classe, callback){
		factory.loadPlannings().success(function (data){
			var temp = [];
			for (var i = data.length - 1; i >= 0; i--) {
				if(data[i].class === classe) {
					temp.push(data[i]);
				}
			};
			callback(temp);
		});

	};

	return factory;

})