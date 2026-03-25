	var login_information= (localStorage.getItem(g_accr_login_info)!=null)?JSON.parse(localStorage.getItem(g_accr_login_info)) : "";
layui.use(['form', 'layer', "okUtils"], function () {
	var form = layui.form,
		layer = layui.layer,
		$ = layui.jquery,
		$form = $('form');
	let okUtils = layui.okUtils;
		$("#text_name").val(login_information.login_name); 
		$("#ID").val(login_information.usid); 
	okLoading.close();
     /**
      * 数据校验
      */
     form.verify({
         password: [/^[a-zA-Z0-9.!@#]{6,20}$/, "密码必须6-20位，且只能输入大小写字母、数字以及特殊字符(.!@#)！"],
	oldPwds: function (value, item) {
		if (value != login_information.password) {
			return "密码错误，请重新输入！";
		}
	},
	confirmPwd: function (value, item) {
		if (!new RegExp($("#oldPwd").val()).test(value)) {
			return "两次输入密码不一致，请重新输入！";
		}
	}
     });
	//修改密码
	form.on("submit(changePwd)", function (data) {
		okUtils.ajax(g_req_url+"System/UserPwdUpdate", "post",JSON.stringify(data.field), true,true).done(function (response) {
			if(response.success=="ok"){
				login_information.password=$("#oldPwd").val();
				localStorage.setItem(g_accr_login_info,JSON.stringify(login_information))
			    $("#uppwd_from")[0].reset();
			    $("#text_name").val(login_information.login_name); 
                success()
			}else{
				errors();
			}
		
		}).fail(function (error) {
		console.log(error)
		});
		return false;
	})
    function success() {
	     layui.use(["okLayx"], function () {
	     let okLayx = layui.okLayx;
	     okLayx.notice({
	         title: "成功提示",
	         type: "success",
	         message: "密码修改成功！"
	         });
	     });
	}
	function errors() {
	     layui.use(["okLayx"], function () {
	         let okLayx = layui.okLayx;
	         okLayx.notice({
	             title: "错误提示",
	             type: "error",
	             message: "密码修改失败！"
	         });
	     });
	}
});

