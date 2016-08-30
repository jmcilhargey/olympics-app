import angular from "angular";
import "angular-ui-router";

angular.module("olympics", ["ui.router"])

.config(($stateProvider, $urlRouterProvider) => {
	$urlRouterProvider.otherwise("/sports")

	$stateProvider
		.state("sports", {
			url: "/sports",
			templateUrl: "sports/sports-nav.html",
			resolve: {
				sportsService: function($http) {
					return $http.get("/sports");
				}
			},
			controller: function(sportsService, $location) {
				this.sports = sportsService.data;

				this.isActive = function(sport) {
					
					let pathRegexp = /sports\/(\w+(\s+\w+)*)/;
          			let match = pathRegexp.exec($location.path());

          			if (match === null || match.length === 0) {
          				return false;
          			}
          			let selectedSportName = match[1];

          			return sport === selectedSportName;
				};
				this.getImage = function(sport) {

					return "../images/" + sport.split(" ").join("_").toLowerCase() + ".svg";
				}
			},
			controllerAs: "sportsCtrl"
		})
		.state("sports.medals", {
			url: "/:sportName",
			templateUrl: "sports/sports-medals.html",
			resolve: {
				sportService: function($http, $stateParams) {
					return $http.get(`/sports/${ $stateParams.sportName }`);
				}
			},
			controller: function(sportService) {
				this.sport = sportService.data;
			},
			controllerAs: "sportCtrl"
		})
		.state("sports.new", {
			url: "/:sportName/medal/new",
			templateUrl: "sports/new-medal.html",
			controller: function($stateParams, $state, $http) {
				this.sportName = $stateParams.sportName;

				this.saveMedal = function(medal) {
					
					$http({ 
						method: "POST", 
						url:`/sports/${ $stateParams.sportName }/medals`, 
						data: { medal }
					}).then(function() {
						$state.go("sports.medals", {
							sportName: $stateParams.sportName
						});
					})					
				}
			},
			controllerAs: "newMedalCtrl"
		})
		.state("sports.graph", {
			url: "/graph",
			templateUrl: "sports/graph-results.html",
			controller: function($stateParams, $state, $http) {
				
			},
			controllerAs: "graphCtrl"
		})
	})
