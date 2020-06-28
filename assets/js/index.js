$(function () {
  // 加载用户基本信息
  getUserInfo()
  // 退出功能
  $("#btn-exit").on("click", function () {
    // 关闭当前页面
    // 删除token
    layer.confirm("你确定要退出吗？", { icon: 3, title: "提示" }, function (index) {
      localStorage.removeItem("token")
      location.href = "/login.html"
      layer.close(index)
    })
  })
})
var art_id = ""
console.log(art_id)
// 加载用户基本信息
function getUserInfo() {
  $.ajax({
    url: "/my/userinfo",
    success: function (res) {
      if (res.status === 0) {
        var name = res.data.nickname || res.data.username
        if (res.data.user_pic) {
          $(".layui-nav-img").attr("src", res.data.user_pic).show()
          $(".img-text").hide()
        } else {
          $(".img-text").css("display", "inline-block").html(name.substr(0, 1).toUpperCase())
          $(".layui-nav-img").hide()
        }
        $("#weclome").html("欢迎&nbsp;&nbsp;" + name)
      }
    },
  })
}
