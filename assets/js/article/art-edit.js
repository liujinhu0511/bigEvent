$(function () {
  // 加载表单模块
  var form = layui.form
  // 初始化加载文章列表的信息
  initArtInfo()
  function initArtInfo() {
    $.ajax({
      url: "/my/article/" + window.parent.art_id,
      success: function (res) {
        if (res.status === 0) {
          form.val("form-edit", res.data)
        }
      },
    })
  }
  // 1. 初始化图片裁剪器
  var $image = $("#image")

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  var state = "已发布"
  $("#btn-draft").click(function () {
    state = "草稿"
  })
  // 根据Id更新文章信息
  $("#form-edit").submit(function (e) {
    e.preventDefault()

    var data = new FormData(this)
    data.append("state", state)
    data.append("Id", window.parent.art_id)
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
          url: "/my/article/edit",
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
