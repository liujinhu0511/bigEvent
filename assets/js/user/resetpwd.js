$(function () {
  var form = layui.form;

  // 表单验证
  form.verify({
    pwdLenght: ["/^w{6,12}$/", "密码的长度是6到12位，且不能有空格"],
    pwdDiff: function (value) {
      var oldPwd = $("#oldPwd").val();
      if (oldPwd === value) {
        return "新旧密码不能一致！";
      }
    },
    pwdSame: function (value) {
      var newPdw = $("#newPwd").val();
      if (newPdw !== value) {
        return "两次密码不一致！";
      }
    },
  });

  // 修改密码
  $(".layui-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          $(".layui-form")[0].reset();
        }
      },
    });
  });
});
