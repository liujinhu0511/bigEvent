$(function () {
  var form = layui.form;
  //自定义验证规则
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称的长度在1 ~ 6 个字符之间";
      }
    },
  });
  //初始化表单数据
  initUserInfo();
  function initUserInfo() {
    $.ajax({
      url: "/my/userinfo",
      success: function (res) {
        layer.msg(res.message);
        if (res.status === 0) {
          form.val("formUserInfo", res.data);
        }
      },
    });
  }

  // 重置表单数据
  $("#btn-reset").click(function (e) {
    e.preventDefault();
    initUserInfo();
  });

  // 修改数据
  $(".layui-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        layer.msg(res.message);
        window.parent.getUserInfo();
      },
    });
  });
});
