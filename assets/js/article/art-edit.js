$(function () {
  // 加载表单模块
  var form = layui.form

  // 获取URL地址栏里面的Id值
  var id = new URLSearchParams(location.search).get("Id")

  // 初始化富文本
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $("#image")

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  }
  // 初始化加载文章列表的信息
  initArtInfo()
  function initArtInfo() {
    $.ajax({
      url: "/my/article/" + id,
      success: function (res) {
        if (res.status === 0) {
          form.val("form-edit", res.data)

          initCate(res.data.cate_id)
          // 3. 初始化裁剪区域 把当前封面地址进行替换
          $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", "http://localhost:3007" + res.data.cover_img) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
        }
      },
    })
  }
  // 加载文章下拉分类
  function initCate(currentCateId = "") {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败！")
        }
        // console.log(res.data.cate_id === currentCateId)
        // 添加一个新属性
        res.currentCateId = currentCateId
        // 调用模板引擎，渲染分类的下拉菜单
        var htmlStr = template("tpl-cate", res)
        $("#category").html(htmlStr)
        // 一定要记得调用 form.render() 方法
        form.render()
      },
    })
  }
  // 选择封面点击事件
  $("#btn-chooseImg").click(function () {
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

  // 定义发布状态
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
