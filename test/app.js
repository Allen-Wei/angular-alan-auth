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
        .map(["/personal", "/logout"], ["employee", "manager"], "/login")     // employee��manager�����Է���/logout��/personal
        .map("/salary", "employee", "/personal")     // ֻ��employee���Է���/salary, ������ɫ���ʻ���ת��/personalҳ��, ����guest��ɫ, ����ת��/personal, �ִ�/personal��ת��/login
        .map("/employee", "manager", "/login");   // ֻ��manager���Է���/employee
});
