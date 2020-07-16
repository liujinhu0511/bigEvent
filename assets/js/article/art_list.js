$(function () {
  var form = layui.form
  var laypage = layui.laypage
  form.render()
  // 补零函数
  function addZero(n) {
    return n > 9 ? n : "0" + n
  }
  // 定义时间过滤器
  template.defaults.imports.dateFormat = function (value) {
    var date = new Date(value)

    var y = date.getFullYear()
    var m = date.getMonth() + 1
    var d = date.getDate()

    var hh = date.getHours()
    var mm = date.getMinutes()
    var ss = date.getSeconds()

    return addZero(y) + "-" + addZero(m) + "-" + addZero(d) + " " + addZero(hh) + ":" + addZero(mm) + ":" + addZero(ss)
  }
  // 文章列表的请求数据
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  }
  // 初始化文章列表
  initArtList()
  function initArtList() {
    $.ajax({
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // layer.msg(res.message)
        if (res.status === 0) {
          // 调用模板引擎渲染分类的可选项
          var htmlStr = template("tpl-artList", res)
          $("tbody").html(htmlStr)
          // 通过 layui 重新渲染表单区域的UI结构
          form.render()
        }
        renderPage(res.total)
      },
    })
  }

  // 初始化文章分类
  initCate()
  function initCate() {
    $.ajax({
      url: "/my/article/cates",
      success: function (res) {
        // layer.msg(res.message)
        if (res.status === 0) {
          // 调用模板引擎渲染分类的可选项
          var htmlStr = template("tpl-cateList", res)
          $("#category").html(htmlStr)
          // 通过 layui 重新渲染表单区域的UI结构
          form.render()
        }
      },
    })
  }

  // 根据筛选的条件显示出结果
  $("#form-search").submit(function (e) {
    e.preventDefault()
    q.cate_id = $('select[name="cate_id"]').val()
    q.state = $('select[name="state"]').val()
    q.pagenum = 1
    initArtList()
  })

  // 加载分页区域
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) {
          initArtList()
        }
      },
    })
  }

  // 根据Id删除文章
  $("tbody").on("click", ".btn-del", function (e) {
    var len = $(".btn-del").length
    layer.confirm("你确定要删除吗？", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        url: "/my/article/delete/" + e.target.dataset.id,
        success: function (res) {
          layer.msg(res.message)
          if (res.status === 0) {
            if (len === 1) {
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
          }
          initArtList()
        },
      })
      layer.close(index)
    })
  })

  //修改文章
  $("tbody").on("click", "#btn-edit", function () {
    location.href = "/article/art_edit.html"
    window.parent.art_id = this.dataset.id
    // console.log(window.parent.art_id)
  })
})
