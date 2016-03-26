angular.module("app.routes", ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "partials/home.tpl.html",
        controller: "HomeCtrl as main"
    }).when("/login", {
        templateUrl: "partials/login.tpl.html",
        controller: "LogInCtrl as main"
    }).when("/logout", {
        templateUrl: "partials/logout.tpl.html",
        controller: "LogOutCtrl as main"
    }).when("/salary", {
        templateUrl: "partials/salary.tpl.html",
        controller: "SalaryCtrl as main"
    }).when("/employee", {
        templateUrl: "partials/employee.tpl.html",
        controller: "EmployeeCtrl as main"
    }).when("/personal", {
        templateUrl: "partials/personal.tpl.html",
        controller: "PersonalCtrl as main"
    }).otherwise("/");

});