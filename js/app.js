'use strict';


// Declare app level module which depends on filters, and services
angular.module('hitemaApp', [
  'ngRoute',
  'hitemaApp.filters',
  'hitemaApp.services',
  'hitemaApp.directives',
  'hitemaApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/connexion', {templateUrl: 'partials/connexion.html', controller: 'UserController'});
  $routeProvider.when('/accueil/:id', {templateUrl: 'partials/accueil.html', controller: 'AccueilController'});
  $routeProvider.when('/staff', {templateUrl: 'partials/staff.html', controller: 'StaffController'});
  $routeProvider.when('/profil/:id', {templateUrl: 'partials/profil.html', controller: 'ProfilController'});
  $routeProvider.when('/absences/:id', {templateUrl: 'partials/absences.html', controller: 'LostController'});
  $routeProvider.when('/news/new/:name', {templateUrl: 'partials/news.html', controller: 'AddNewsController'});
  $routeProvider.when('/users/new', {templateUrl: 'partials/createUser.html', controller: 'CreateUserController'});
  $routeProvider.when('/planning/:classe', {templateUrl: 'partials/planning.html', controller: 'ShowPlanningController'});
  $routeProvider.when('/gestion/eleves', {templateUrl: 'partials/gestionEleve.html', controller: 'GestionEleveController'});
  $routeProvider.when('/gestion/eleves/gestionAbsences/:id', {templateUrl: 'partials/gestionAbsences.html', controller: 'GestionAbsencesController'});
  $routeProvider.when('/gestion/plannings', {templateUrl: 'partials/gestionPlannings.html', controller: 'GestionPlannings'});
  $routeProvider.when('/gestion/planning/:classe', {templateUrl: 'partials/gestionPlanning.html', controller: 'GestionPlanning'});

  $routeProvider.otherwise({redirectTo: '/connexion'});
}]);
