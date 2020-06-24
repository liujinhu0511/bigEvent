$(function () {
  // 加载form模块
  var form = layui.form;

  // 切换登录和注册
  $("#link_reg").click(function () {
    $(".login-box").hide().siblings().show();
  });
  $("#link_login").click(function () {
    $(".reg-box").hide().siblings().show();
  });

  //表单验证
  form.verify({
    //  密码长度
    pwdLength: [/^\w{6,12}$/, "密码长度是6到12位且不能有空格"],
    // 验证密码是否一致
    pwdSame: function (value) {
      var pwd = $("#pwd").val();
      if (pwd !== value) {
        return "两次密码不一致";
      }
    },
  });

  // 注册用户
  $("#reg-form").submit(function (e) {
    // 阻止默认行为
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: $(this).serialize(),
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          $("#link_login").click();
        }
      },
    });
  });

  // 登录
  $("#login-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          location.href = "/index.html";
          localStorage.setItem("token", res.token);
        }
      },
    });
  });
});
