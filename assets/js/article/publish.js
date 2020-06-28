$(function () {
  var form = layui.form
  // 重新渲染表单数据
  form.render()

  // 初始化富文本
  initEditor()
  // 1. 初始化图片裁剪器
  var $image = $("#image")

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 加载下拉框文章分类数据
  initCategory()
  function initCategory() {
    $.ajax({
      url: "/my/article/cates",
      success: function (res) {
        $("#category").html(template("tpl-cate", res))
        form.render()
      },
    })
  }
  // 设置发表状态
  var state = "已发布"
  $("#btn-draft").click(function () {
    state = "草稿"
  })

  // 选择封面点击事件
  $("#btn-chooseImg").click(function () {
    console.log(111)
    $("#file").click()
  })

  //当文件域发生改变时
  $("#file").change(function () {
    var files = this.files[0]
    var newURL = URL.createObjectURL(files)
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 监听表单提交事件
  $("#form-pub").submit(function (e) {
    e.preventDefault()

    var data = new FormData(this)
    data.append("state", state)

    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 获取表单提交的数据
        data.append("cover_img", blob)
        $.ajax({
          type: "POST",
          url: "/my/article/add",
          data: data,
          success: function (res) {
            layer.msg(res.message)
            location.href = "/article/art_list.html"
          },
          contentType: false,
          processData: false,
        })
      })
  })
})
