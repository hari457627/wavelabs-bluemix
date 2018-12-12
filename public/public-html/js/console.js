var app= angular.module("wavelabs",['ui.router','ngLodash','ngSanitize']);
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider, $urlRouterProvider){
 $urlRouterProvider.otherwise("/console");
 
 $stateProvider.
 state('console',{
  url : '/console',
  templateUrl : 'console/console.html'
    })
.state('content', {             
  url: '/content/:creativeId',            
  templateUrl: 'content/content.html',
  params: { creativeId : null }                 
})
 .state('documents',{
  url : '/documents',
  templateUrl : 'documents/documents.html'
})
 .state('docs',{
  url : '/docs',
  templateUrl : 'documents/docs-content.html'
})
 .state('catalog',{
  url : '/catalog',
  templateUrl : 'console/console.html'
})
 .state('docs-starters',{
  url : '/docs-starters',
  templateUrl : 'documents/docs-starters.html'
})
 .state('login',{
  url : '/login',
  templateUrl : 'login/console-login.html'
})
 .state('register',{
  url : '/register',
  templateUrl : 'login/console-register.html'
}); 
}]);

app.controller("myctrl", ['$scope','$http','$state','lodash',"$sce", function($scope,$http,$state,lodash,$sce){
  $http.get('js/datas.json')
  .then(function(response){
     $scope.categories = response.data.categori;
     $scope.starters = [];
     $scope.products = response.data.producted;
     $scope.display = [];
     $scope.filtered = [];
     $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
    }
    $scope.movie = {src:"http://calendarapp-muggier-electromagnetist.cfapps.io/swagger-ui.html"};
    $scope.myvalue = false;
    $scope.run = function(){
      $scope.myvalue = true;  
    }
      $scope.getProductsList = function(){
        $scope.display = [];
        angular.forEach($scope.categories,function(value,index){
          var category = {
            "id":value.categoryId,
            "name": value.CategoryName,
            "description": value.description,
            "subCategories": []
          };
          angular.forEach(value.subCategories,function(value,index){
            var subCategory = {
              "id":value.categoryId,
              "name": value.CategoryName,
              "products": []
            };
            angular.forEach($scope.products,function(value,index){
              if(value.categoryId === subCategory.id) {
                subCategory.products.push(value);
              }  
            });
            category.subCategories.push(subCategory);
          });
          $scope.display.push(category);
          $scope.filtered = $scope.display;
        });
      }

    $scope.startered = function(starter){
      $scope.startercont = starter;
    }

    $scope.filterProductsByCategory =function(categoryId){
      $scope.filtered =  lodash.filter($scope.display, function(category){ 
        return category.id == categoryId;}
        );
    };
    $scope.filterProductsBySubCategory =function(subCategoryId){
         $scope.filtered = [];
         lodash.filter($scope.display, function(category){ 
              for(i = 0; i < category.subCategories.length; i++) {
                var subCategory = category.subCategories[i];
                if(subCategory.id == subCategoryId){
                  $scope.filtered.push({
                     "id":category.id,
                    "name": category.name,
                    "description": category.description,
                    "subCategories": [subCategory]
                  });
                  return subCategory.id == subCategoryId
                }
              }
          });
    };

  
$scope.contented = function(prod){
        $scope.arrayX = [];
        $scope.features = [];
        $scope.carosalimages = [];
        $state.go('content', {
          creativeId: prod.productId            
        });        
        $scope.productObj = prod;
        $scope.arrayX.push(prod); 
        $scope.features = $scope.arrayX[0].features;
        $scope.caroselimg = $scope.arrayX[0].images;
}; 
   
  $scope.welcomeUser = null;
  $scope.accesstoken = null;
  $scope.final_token = null;
  $scope.user = {};
  $scope.reg_user={};

var jsondata = {
    "client_id" : "b88f5f8b-5585-4b0b-91e8-e752fec907af",
    "client_secret" : "wavelabs-bluemix-console",
    "grant_type" : "client_credentials",
    "Content-Type" : "x-www-form-urlencoded"  
}


$scope.generate = function(){
  $http({
          method  : 'POST',
          url     : 'http://api.qa1.nbos.in/oauth/token',
          params  : jsondata,
          headers : {
            "Accept" : "application/json" } 
         })
          .then(function myFunction(response) {            
            $scope.access1 = response.data.access_token;
            $scope.access2 = response.data.token_type;
            
            $scope.final_token = $scope.access2 + " " + $scope.access1;
            console.log($scope.final_token);
          });
}

$scope.register = function() {
        $http({
          method  : 'POST',
          url     : 'http://api.qa1.nbos.in/api/identity/v0/users/signup',
          data    : $scope.reg_user,
          headers : {'Authorization': $scope.final_token} 
         })
          .then(function myFunction() {
            $state.go("login");
          });
        };
        $scope.loginclass = true;


$scope.login = function(){  
  $http({
          method  : 'POST',
          url     : 'http://api.qa1.nbos.in/api/identity/v0/auth/login',
          data    : $scope.user,
          headers : {'Authorization': $scope.final_token} 
         })
          .then(function myFunction(response) {
            $scope.welcomeUser = "Hi.." + (response.data.member.firstName + response.data.member.lastName);
            $scope.accesstoken = response.data.token.access_token;
            $scope.loginclass = false;
            $state.go("console");
          });
};

$scope.logout = function(){
  $http({
          method  : 'GET',
          url     : 'http://api.qa1.nbos.in/api/identity/v0/auth/logout',
          headers : {
            'Authorization': 'Bearer ' + $scope.accesstoken } 
         })
          .then(function myFunction(response) {
            $scope.loginclass = true;
            $scope.user={};
          });
}


$scope.init = function(){
    $scope.getProductsList();
    for (var i = $scope.products.length - 1; i >= 0; i--) {
      if ($scope.products[i].categoryId == 8) {
        $scope.starters.push($scope.products[i]);
      };
    };
$scope.generate();
};
$scope.init();

})
}]);


