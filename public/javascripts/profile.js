var token = $.cookie("token") ;
$.post('/user_name', {token:token}).then(data=>{
	$('#ho').html('<input class="form-control" type="text" value="'+data.Ho+'" id="ipHo" name="ho">');
	$('#ten').html('<input class="form-control" type="text" value="'+data.TenKH+'" id="ipTen" name="ten"> ');
	$('#tuoi').html('<input class="form-control" type="text" value="'+data.Tuoi+'" id="ipTuoi" name="tuoi">');
	$('#tencongty').html('<input class="form-control" type="text" value="'+data.TenCongTy+'" id="ipTenCongTy" name="tencongty">');
	$('#nghenghiep').html('<input class="form-control" type="text" value="'+data.NgheNghiep+'" id="ipNgheNghiep" name="nghenghiep">');
	$('#sdt').html('<div name="sdt" class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="la la-phone"></i></span></div><input type="text" class="form-control" value="'+data.Sdt+'" placeholder="Phone" aria-describedby="basic-addon1" id="ipSdt"></div>');
	$('#email').html('<div name="email" class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="la la-at"></i></span></div><input type="text" class="form-control" value="'+data.Email+'" placeholder="Email" aria-describedby="basic-addon1" id="ipEmail" ></div>');
	$('#diachi').html('<div name="diachi" class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="la la-map-marker"></i></span></div><input type="text" class="form-control" value="'+data.DiaChi+'" placeholder="Address" aria-describedby="basic-addon1" id="ipDiaChi"></div>')
	$('#tennguoidung').html('<div name="tennguoidung" class="kt-spinner kt-spinner--sm kt-spinner--success kt-spinner--right kt-spinner--input"><input class="form-control" type="text" value="'+data.username+'" disabled></div>');
	$('#diachiemail').html('<div name="diac" class="input-group"><div class="input-group-prepend"><span class="input-group-text"><i class="la la-at"></i></span></div><input type="text" class="form-control" value="'+data.Email+'" placeholder="Email" aria-describedby="basic-addon1" id="ipDiaChiEmail"></div>');
	$('#username').html(data.username);
});

$("#save").click(function (event) {
	// $("#kt_form").submit(function (event) {
		event.preventDefault();
		$.post("/profile", {token: token}).then(user=>{
			console.log(user);
			$.post('/edit_user',{
			_id: user.makh,
			Ho: $('#ipHo').val(),
			TenKH : $('#ipTen').val(),
			Tuoi : $('#ipTuoi').val(),
			TenCongTy : $('#ipTenCongTy').val(),
			NgheNghiep : $('#ipNgheNghiep').val(),
			Sdt  : $('#ipSdt').val(),
			Email : $('#ipEmail').val(),
			DiaChi : $('#ipDiaChi').val()
			}).then(data=>{alert("Cập nhật thành công!!")})
		})
			
	});


function signout()
	{
		$.post('/sign_out',{token:token}).then(deletedb=>{
			console.log(deletedb);
			window.location.href ="http://localhost:3000/login1";
		})
		$.removeCookie('token');
		$.removeCookie('connect.sid');
	}