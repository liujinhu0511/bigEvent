$(function () {
  $.ajaxPrefilter(function (options) {
    // 配置统一url
    options.url = 'http://www.liulongbin.top:3007' + options.url;
  })
})