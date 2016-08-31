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
		.state("sports.graph", {
			url: "/graph",
			template: "<world-graph></world-graph>"
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
	})

.directive("worldGraph", function() {

	return {
		restrict: "E",
		link: function(scope, element, attrs) {

			var width = 1000;
			var height = 500;

			var canvas = d3.select(element[0])
				.append("canvas")
				.attr("width", width)
				.attr("height", height);
			
			var context = canvas.node().getContext("2d")

			var projection = d3.geoEquirectangular()
				.scale(200);

			var path = d3.geoPath()
				.projection(projection)
				.context(context);

			d3.json("../data/world-map-data.json", function(error, world) {
				
				if (error) { throw error; }

				path(topojson.feature(world, world.objects.countries));
				context.globalAlpha = 0.6;
				context.lineWidth = 1;
				context.lineJoin = "round";
				context.stroke();
				path(topojson.feature(world, world.objects.land));
				context.fillStyle = "#bfc0c0";
				context.fill();

				var radius = d3.scaleSqrt().domain([0, 125]).range([0, 50]);				

				createPoints(topojson.feature(world, world.objects.countries).features);

				function createPoints(worldData) {

					var points = d3.select("canvas").append("div");

					d3.json("../data/world-medal-data.json", function(error, medalData) {

						if (error) { throw error; }

						points.selectAll("points.arc")
							.data(worldData)
							.enter()
							.append("points")
							.classed("arc", true)
							.attr("x", function(d) { return path.centroid(d)[0]; })
							.attr("y", function(d) { return path.centroid(d)[1]; })
							.attr("radius", function(d) { return radius(medalData[d.id] ? medalData[d.id].total : 0) })
							.attr("fillStyle", "#00E676")
							.attr("fillText", function(d) { return medalData[d.id] && medalData[d.id].total > 1 ? medalData[d.id].total : ""; }, function(d) { return path.centroid(d)[0]; }, function(d) { return path.centroid(d)[1]; });

						drawPoints(points);
					});
				}

				function drawPoints(points) {
					
					var elements = d3.selectAll("points.arc");
					console.log(elements)
					elements.each(function(d) {

						    var node = d3.select(this);
							
		   					context.beginPath();
							context.arc(node.attr("x"), node.attr("y"), node.attr("radius"), 0, 2 * Math.PI);
							context.fillStyle = node.attr("fillStyle");
		    				context.fill();
		    				context.font = "16px arial";
							context.fillStyle = "#FF3D00";
							context.fillText(node.attr("fillText"), node.attr("x") - 10, node.attr("y"))
		    				context.stroke();
		    				context.closePath();
					});
				}
			});
		}
	};
});
