console.log('test');

function killscreen(){
var source   = $("#entry-template").html();
var template = Handlebars.compile(source);
console.log(source);

var context = {title: "My New Post", body: "This is my first post!"};
var html    = template(context);
}