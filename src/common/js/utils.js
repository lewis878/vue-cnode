

export var menuList = [
  {
    to: '/',
    name: 'all',
    text: '首页'
  },
  {
    to: '/?tab=good',
    name: 'good',
    text: '精华'
  },
  {
    to: '/?tab=share',
    name: 'share',
    text: '分享'
  },
  {
    to: '/?tab=ask',
    name: 'ask',
    text: '问答'
  },
  {
    to: '/?tab=job',
    name: 'job',
    text: '招聘'
  },
  {
    to: '/?tab=dev',
    name: 'dev',
    text: '测试'
  },
  {
    to: '/message',
    name: 'message',
    text: '消息'
  },
  {
    to: '/about',
    name: 'about',
    text: '关于'
  }
]

export function getLastTime(str) {
  var d = new Date(str)
  var diff = (new Date() - d) / 1000

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.floor(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 7) {
    return Math.floor(diff / (3600 * 24)) + '天前'
  } else if (diff < 3600 * 24 * 30) {
    return Math.floor(diff / (3600 * 24 * 7)) + '周前'
  } else if (diff < 3600 * 24 * 30 * 12) {
    return Math.floor(diff / (3600 * 24 * 30)) + '个月前'
  } else {
    return Math.floor(diff / (3600 * 24 * 30 * 12)) + '年前'
  }
}

export function getTagInfo(item) {
  var schema = {
    top: {
      text: '置顶',
      className: 'top'
    },
    good: {
      text: '精华',
      className: 'good'
    },
    share: {
      text: '分享',
      className: 'share'
    },
    ask: {
      text: '问答',
      className: 'ask'
    },
    job: {
      text: '招聘',
      className: 'job'
    },
    dev: {
      text: '测试',
      className: 'dev'
    }
  }

  if (item.top) {
    return schema.top
  } else if (item.good) {
    return schema.good
  } else if (item.tab) {
    return schema[item.tab]
  } else {
    return {
      text: '暂无',
      className: ''
    }
  }
}

// 函数节流
export function throttle(method, delay, duration) {
  var timer = null;
  var begin = new Date();
  return function () {
    var context = this, args = arguments;
    var current = new Date();
    clearTimeout(timer);
    if (current - begin >= duration) {
      method.apply(context, args);
      begin = current;
    } else {
      timer = setTimeout(function () {
        method.apply(context, args);
      }, delay);
    }
  }
}

// 判断滚动条滚动方向
export function scroll(fn) {
  var beforeScrollTop = window.pageYOffset
  window.addEventListener("scroll", function () {
    var afterScrollTop = window.pageYOffset
    var delta = afterScrollTop - beforeScrollTop
    if (delta === 0) return false
    fn(delta > 0 ? "down" : "up")
    beforeScrollTop = afterScrollTop
  }, false)
}
