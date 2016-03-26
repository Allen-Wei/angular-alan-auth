/// <reference path="../src/alan-auth.js" />
/// <reference path="vendor/angular.js" />
/// <reference path="services/user.js" />

angular.module("AlanAuthTestApp", [
	"ngRoute",
	"app.routes",
	"app.controllers",
	"app.services",
	"alanAuth"
]).run(function (AlanAuth, User) {
    User.role = "guest";

    AlanAuth.setIsInRole((roles, ctrl) => { return roles.indexOf(User.role) !== -1; })
        .map("/", ["guest", "employee", "manager"])
        .map("/login", ["guest"], "/personal")
        .map(["/personal", "/logout"], ["employee", "manager"], "/login")     // employee和manager都可以访问/logout和/personal
        .map("/salary", "employee", "/personal")     // 只有employee可以访问/salary, 其他角色访问会跳转到/personal页面, 对于guest角色, 先跳转到/personal, 又从/personal跳转到/login
        .map("/employee", "manager", "/login");   // 只有manager可以访问/employee
});
