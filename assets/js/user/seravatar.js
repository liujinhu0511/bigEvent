$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image")
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 上传点击触发文件上传点击事件
  $("#unload").click(function () {
    $("#file").click()
  })
  // 当文件域发生改变生成临时url
  $("#file").change(function (e) {
    var newURL = URL.createObjectURL(e.target.files[0])
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域  });
  })
  // 点击确定更换头像
  $("#btn-sure").click(function () {
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png") // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
      type: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        layer.msg(res.message)
        if (res.status === 0) {
          window.parent.getUserInfo()
        }
      },
    })
  })
})
