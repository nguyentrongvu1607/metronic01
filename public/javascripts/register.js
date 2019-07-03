    $(".kt-form").validate({
        rules: {
            username: {
                required: true,
                minlength: 5
            },

            password: {
                required: true,
                minlength: 5
            },
        },

        messages: {
            username: {
                required: "Vui lòng nhập tên đăng nhập",
                minlength: "Tên đăng nhập ít nhất là 5 ký tự!"
            },

            password: {
                required: "Vui lòng nhập mật khẩu",
                minlength: "Mật khẩu ít nhất là 5 ký tự!"
            }
        },
    });

    $(".kt-form").submit(function(event) {
        if (!$(".kt-form").valid()) {
            return
        }
        // dung ajax call 
        $.post("/register", {
                username: $('#username').val(),
                password: $('#password').val(),
                email : "",
                ho :"",
                ten : "",
                tencongty : "",
                diachi : "",
                sdt : "",
                tuoi : 18,
                nghenghiep : ""
            })
            .done(function(data) {
                console.log(data)
                if (data.success == 1) {
                    alert('Đăng ký thành công')
                    window.location = 'http://localhost:3000/login1';
                } else {
                    alert('Tài khoản bị trùng');
                }
            });
        event.preventDefault();
    });