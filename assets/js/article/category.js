$(function () {
  var form = layui.form
  // 初始化文章分类数据
  initCategory()
  function initCategory() {
    $.ajax({
      url: "/my/article/cates",
      success: function (res) {
        layer.msg(res.message)
        $("tbody").html(template("tpl-cateList", res))
      },
    })
  }
  var indexAdd = ""
  var indexExit = ""
  //点击添加类别显示弹出层
  $("#addCate").click(function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#tpl-addCate").html(),
    })
  })

  // 这里的form表单动态添加 需要用事件委托来添加类别
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault()

    $.ajax({
      type: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        layer.msg(layer.message)
        if (res.status === 0) {
          initCategory()
          layer.close(indexAdd)
        }
      },
    })
  })

  // 根据id删除文章分类
  $("tbody").on("click", "#btn-del", function () {
    $.ajax({
      url: "/my/article/deletecate/" + this.dataset.id,
      success: function (res) {
        layer.msg(res.message)
        if (res.status === 0) {
          layer.confirm("你确定要删除吗？", { icon: 3, title: "提示" }, function (index) {
            initCategory()
          })
        }
      },
    })
  })

  // 点击编辑显示修改弹出层 加载最初数据
  $("tbody").on("click", "#btn-exit", function () {
    $.ajax({
      url: "/my/article/cates/" + this.dataset.id,
      success: function (res) {
        indexExit = layer.open({
          type: 1,
          area: ["500px", "250px"],
          title: "修改分类信息",
          content: $("#tpl-exitCate").html(),
        })
        form.val("formCateList", res.data)
      },
    })
  })
  // 修改文章分类信息
  $("body").on("submit", "#form-exit", function (e) {
    e.preventDefault()
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        layer.msg(res.message)
        if (res.status === 0) {
          initCategory()
          layer.close(indexExit)
        }
      },
    })
  })
})
