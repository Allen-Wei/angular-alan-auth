  angular.module("UiRouterDemo", ["ui.router", "alan.auth.ui.router"]).config(function($stateProvider, $urlRouterProvider) {

        //设置状态
      $urlRouterProvider.otherwise("/");

      $stateProvider.state("home", {
          url: "/",
          templateUrl: "partials/home.html",
          controller: "HomeCtrl as main"
      }).state("module", {
          url: "/module",
          templateUrl: "partials/module.html",
          controller: "ModuleCtrl as main"
      }).state("module.method", {
          url: "/method?name&displayName",
          templateUrl: "partials/module.method.html",
          controller: "ModuleMethodCtrl as main"
      }).state("class", {
          url: "/class",
          templateUrl: "partials/class.html",
          controller: "ClassCtrl as main"
      }).state("class.detail", {
          url: "/detail?name",
          templateUrl: "partials/class.detail.html",
          controller: "ClassDetailCtrl as main"
      });
  }).factory("User", function() {
    //用户信息服务
      return {
          role: "guest"
      };
  }).run(function(AlanAuthUiRouter, User) {
    //设置状态验证授权
      AlanAuthUiRouter.setIsInRole(function(roles, params) {
              return roles.indexOf(User.role) !== -1;
          }).map(["module", "module.method"], "module", "home")
          .map(["class", "class.detail"], "class", "home");

  }).controller("BodyCtrl", function(User, $state) {
      this.current = User;
  }).controller("HomeCtrl", function(User) {
      this.user = User;
  }).controller("ModuleCtrl", function() {
      this.modules = NODEJS.modules.filter(function(module) {
          return !!module.displayName;
      }).map(function(module) {
          return {
              name: module.name,
              displayName: module.displayName
          }
      });
  }).controller("ModuleMethodCtrl", function($stateParams) {
      this.module = NODEJS.modules.filter(function(module) {
          return module.name === $stateParams.name;
      })[0];

  }).controller("ClassCtrl", function() {
      this.classes = NODEJS.classes.filter(function(item) {
          return {
              name: item.name,
              textRaw: item.textRaw
          };
      });
  }).controller("ClassDetailCtrl", function($stateParams) {
      this.detail = NODEJS.classes.filter(function(item) {
          return item.name == $stateParams.name;
      })[0];

      this.detail.descText = angular.element(this.detail.desc).text();
  });