var token = $.cookie("token") ;
$.post('/user_name', {token:token}).then(data=>{
	console.log(data)
	var name_chat = data.username;
	$('#username').html(data.username);
	$('#TenKH').html(data.TenKH);
})

function signout()
{
$.post('/sign_out',{token:token}).then(deletedb=>{
console.log(deletedb);
window.location.href ="http://localhost:3000/login1";
})
$.removeCookie('token');
}