(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _index = require('./index');

exports.bottomSeckill = function () {
  (function () {
    // 拿到countdown-desc中的strong
    var strong = document.getElementsByClassName('countdown-desc')[0].children;
    // 拿到timmer__unit--hour中的元素
    var timmer_unit_hours = document.getElementsByClassName('timmer__unit--hour')[0];
    // 拿到timmer__unit--minute中的元素
    var timmer_unit_minute = document.getElementsByClassName('timmer__unit--minute')[0];
    // 拿到timmer__unit--second中的元素
    var timmer__unit_second = document.getElementsByClassName('timmer__unit--second')[0];
    // 获取时间的
    function getDate() {
      // 判断时间戳
      var date = new Date();
      var minute, secode, hours, touch;
      /*var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 16:00:00`);
      var nowTimer =+new Date(); 
      var timer = (afterTimer - nowTimer) / 1000;
      var timerid = setInterval(() => {
        timer --;
        if(timer <= 0) {
          clearInterval(timerid);
        }
        // 2.3
        hours = Math.floor(timer/60/60%24);
        minute = Math.floor(timer/60%60);
        secode = Math.floor(timer%60);
        timmer_unit_hours.innerText = hours;
        timmer_unit_minute.innerText = minute;
        timmer__unit_second.innerText = secode;
      },1000);*/
      var timerid = setInterval(function () {
        if (date.getHours() >= 14 && date.getHours() < 16) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 16:00:00');
          touch = '16:00';
        } else if (date.getHours() >= 16 && date.getHours() < 18) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 18:00:00');
          touch = '18:00';
        } else if (date.getHours() >= 18 && date.getHours() < 20) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 20:00:00');
          touch = '20:00';
        } else if (date.getHours() >= 20 && date.getHours() < 22) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 22:00:00');
          touch = '22:00';
        } else if (date.getHours() >= 8 && date.getHours() < 10) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 10:00:00');
          touch = '10:00';
        } else if (date.getHours() >= 10 && date.getHours() < 12) {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 12:00:00');
          touch = '12:00';
        } else {
          var afterTimer = +new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1) + ' 8:00:00');
          touch = '08:00';
        }
        var timer = (afterTimer - new Date()) / 1000;
        hours = Math.floor(timer / 60 / 60 % 24);
        minute = Math.floor(timer / 60 % 60);
        secode = Math.floor(timer % 60);
        timmer_unit_hours.innerText = hours;
        timmer_unit_minute.innerText = minute;
        timmer__unit_second.innerText = secode;
        strong[0].innerText = touch;
      }, 1000);
    }
    getDate();
  })();
};
exports.bottomSlider = function () {
  (function () {
    // 拿到slider_wrapper中的元素
    var sliderWrapper = document.getElementsByClassName('slider_wrapper')[2];
    // 拿到slider_control_prev中的元素
    var sliderControlPrev = document.getElementsByClassName('slider_control_prev')[2];
    // 拿到slider_control_next中的元素
    var sliderControlPNext = document.getElementsByClassName('slider_control_next')[2];
    var speed = 0,
        timer = null;
    function start() {
      // 定时器移动
      timer = setInterval(function () {
        if (speed === -3200) {
          speed = 0;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
        } else {
          speed -= 800;
          sliderWrapper.style.transition = 'all 500ms ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          setTimeout(function () {
            sliderWrapper.style.transition = 'none 0s ease 0s';
          }, 500);
        }
      }, 8000);
    }
    function wrapper(speed) {
      sliderWrapper.style.transition = 'all 500ms ease 0s';
      sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
      setTimeout(function () {
        clearInterval(timer);
        sliderWrapper.style.transition = 'none 0s ease 0s';
        start();
      }, 2000);
    }
    function startClick() {
      sliderControlPrev.addEventListener('click', function () {
        // 停止定时器
        clearInterval(timer);
        if (speed >= 0) {
          speed = -3200;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          return;
        } else {
          speed += 800;
        }
        wrapper(speed);
      });
      sliderControlPNext.addEventListener('click', function () {
        clearInterval(timer);
        if (speed === -3200) {
          speed = 0;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          return;
        } else {
          speed -= 800;
        }
        wrapper(speed);
      });
    }
    function wrapperMouse() {
      sliderWrapper.addEventListener('mouseover', function () {
        clearInterval(timer);
      });
      sliderWrapper.addEventListener('mouseleave', function () {
        clearInterval(timer);
        start();
      });
    }
    start();
    startClick();
    wrapperMouse();
  })();
};
exports.bottomWrapper = function () {
  (function () {
    // 拿到slider_wrapper元素
    var sliderWrapper = document.getElementsByClassName('slider_wrapper')[3];
    // 拿到button按钮slider_indicators_btn 
    var sliderIndicatorsBtn = document.getElementsByClassName('slider_indicators_btn');
    // 定义speed
    var speed = 0,
        timer = null;
    //sliderWrapper.style.transition = '500ms ease-in-out 0s';
    //sliderWrapper.style.transform = "translate3d(-180px, 0px, 0px)";
    function start() {
      timer = setInterval(function () {
        if (speed === -540) {
          speed = -180;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
        } else {
          speed += -180;
          if (speed === -360) {
            sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
            sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn');
          } else {
            sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
            sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn');
          }
          sliderWrapper.style.transition = '500ms ease-in-out 0s';
          sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
          setTimeout(function () {
            sliderWrapper.style.transition = 'none 0s ease 0s';
          }, 500);
        }
      }, 2000);
    }
    function stopSlider(index, speed) {
      sliderWrapper.style.transition = '500ms ease-in-out 0s';
      sliderWrapper.style.transform = 'translate3d(' + speed + 'px, 0px, 0px)';
      if (index === 0) {
        sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
        sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn');
      } else {
        sliderIndicatorsBtn[9].setAttribute('class', 'slider_indicators_btn slider_indicators_btn_active');
        sliderIndicatorsBtn[8].setAttribute('class', 'slider_indicators_btn');
      }
      setTimeout(function () {
        sliderWrapper.style.transition = 'none 0s ease 0s';
      }, 500);
      setTimeout(function () {
        clearInterval(timer);
        start();
      }, 1500);
    }
    // 给sliderIndicatorsBtn添加移入事件
    function sliderIndicatorsBtnOver() {
      sliderIndicatorsBtn[8].addEventListener('mouseover', function () {
        clearInterval(timer);
        if (speed === -180) {
          speed = 0;
        } else {
          speed = -360;
        }
        stopSlider(0, speed);
      });
      sliderIndicatorsBtn[9].addEventListener('mouseover', function () {
        clearInterval(timer);
        if (speed === 0) {
          speed = -180;
        } else {
          speed = -540;
        }
        stopSlider(1, speed);
      });
    }
    start();
    sliderIndicatorsBtnOver();
  })();
};
exports.boxHdArrow = function () {
  (function () {
    // 拿到元素
    var boxHdArrow = document.getElementsByClassName('box_hd_arrow1');
    for (var i = 0; i < boxHdArrow.length; i++) {
      boxHdArrow[i].addEventListener('mouseover', function () {
        this.setAttribute('class', 'box_hd_arrow1 box_hd_arrow');
      });
      boxHdArrow[i].addEventListener('mouseleave', function () {
        this.setAttribute('class', 'box_hd_arrow1');
      });
    }
  })();
};
exports.boxBottomOver = function () {
  (function () {
    // 拿到tab_body_item的元素
    var tabBodyItem = document.getElementsByClassName('tab_body_item');
    // 拿到tab_head_item的元素
    var tabHeadItem = document.getElementsByClassName('tab_head_item');
    var arr = [0, 1, 2, 3, 4];
    // 处理过滤结果
    function filterDom(index) {
      var manyArr = (0, _index.filterArr)(arr, index);
      manyArr.map(function (ele) {
        tabBodyItem[ele].style.display = 'none';
        tabHeadItem[ele].setAttribute('class', 'tab_head_item');
      });
      // 改变和index相等的DOM元素
      tabHeadItem[index].setAttribute('class', 'tab_head_item active');
      tabBodyItem[index].style.display = 'block';
    }

    var _loop = function _loop(i) {
      tabHeadItem[i].addEventListener('mouseover', function () {
        filterDom(i);
      });
    };

    for (var i = 0; i < tabHeadItem.length; i++) {
      _loop(i);
    }
  })();
};

exports.logoHover = function () {
  (function () {
    // 拿到元素
    var logoTextChildren = document.getElementsByClassName('logo-text')[0].children[0];
    // 拿到元素
    var scrollPoints = document.getElementsByClassName('scroll-points')[0];
    var goodsList = document.getElementsByClassName('goods-list')[0];
    var niceGoodsNiceRecommends = document.getElementsByClassName('nice-goods__recommends')[0];
    var scrollBar = document.getElementsByClassName('scroll-bar')[0];
    var speed = 0,
        sliderSpeed = 0,
        timer = void 0;
    // 拿到nice-goods__logo
    var niceGoodsLogo = document.getElementsByClassName('nice-goods__logo')[0];
    function mouseOver() {
      niceGoodsLogo.addEventListener('mouseover', function () {
        logoTextChildren.setAttribute('class', 'logo-text_show');
        scrollBar.style.opacity = 1;
        clearInterval(timer);
      });
      niceGoodsLogo.addEventListener('mouseleave', function () {
        logoTextChildren.removeAttribute('class');
        scrollBar.style.opacity = 0;
        clearInterval(timer);
        slider();
      });
    }
    function slider() {
      timer = setInterval(function () {
        if (speed < -1020 || sliderSpeed > 860) {
          speed = 0;
          sliderSpeed = 0;
          goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
          scrollPoints.style.left = sliderSpeed + 'px';
        } else {
          speed += -20.4;
          sliderSpeed += 17.2;
          goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
          scrollPoints.style.left = sliderSpeed + 'px';
        }
      }, 1000);
    }
    function sliderMove() {
      scrollPoints.addEventListener('mousedown', function (event) {
        var _this = this;

        var e = event || window.event;
        var offset = e.clientX - this.offsetLeft;
        document.onmousemove = function (event) {
          clearTimeout(timer);
          var e = event || window.event;
          var x = e.clientX - offset;
          if (x <= 0) {
            sliderSpeed = 0, speed = 0;
            _this.style.left = 0 + 'px';
            goodsList.style.transform = 'translate3d(0px,0,0)';
            return;
          } else if (x >= 861) {
            sliderSpeed = 861, speed = -1020;
            _this.style.left = 861 + 'px';
            goodsList.style.transform = 'translate3d(-1020px,0,0)';
            return;
          } else {
            if (x > sliderSpeed) {
              //  代表是往右边走的
              sliderSpeed = x;
              //console.log(speed);
              speed -= 28 * 0.1;
              goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
            } else {
              // 代表往左边走到
              sliderSpeed = x;
              speed += 25 * 0.1;
              goodsList.style.transform = 'translate3d(' + speed + 'px,0,0)';
            }
            _this.style.left = x + 'px';
          }
        };
        document.onmouseup = function () {
          this.onmousemove = null;
          clearTimeout(timer);
          slider;
        };
      });
    }
    function niceMove() {
      niceGoodsNiceRecommends.addEventListener('mouseover', function () {
        // 显示scrollBar
        scrollBar.style.opacity = 1;
        // 停止定时器
        clearInterval(timer);
      });
      niceGoodsNiceRecommends.addEventListener('mouseleave', function () {
        // 显示scrollBar
        scrollBar.style.opacity = 0;
        // 停止定时器
        clearInterval(timer);
        slider();
      });
    }
    mouseOver();
    slider();
    sliderMove();
    niceMove();
  })();
};
},{"./index":4}],2:[function(require,module,exports){
'use strict';

var _index = require('./index');

exports.middleNavImage = function () {
  (function () {
    // 引入slider_wrapper中的li
    var sliderWrapper = document.getElementsByClassName('slider_wrapper')[0].children;
    // 引入slider_indicators中的i
    var sliderIndicators = document.getElementsByClassName('slider_indicators')[0].children;
    // 拿到左侧点击按钮slider_control_prev
    var buttonLeft = document.getElementsByClassName('slider_control_prev')[0];
    // 拿到右侧点击按钮
    var buttonRight = document.getElementsByClassName('slider_control_next')[0];
    // 拿到sliderBannerWrapper元素
    var sliderList = document.getElementsByClassName('slider_list')[0];
    var id = 0,
        timer = void 0;
    var arr = [0, 1, 2, 3, 4, 5, 6, 7];
    function test(i) {
      var toArr = (0, _index.filterArr)(arr, i);
      toArr.map(function (ele) {
        sliderWrapper[ele].style.opacity = 0;
        sliderWrapper[ele].style.zIndex = 0;
        sliderIndicators[ele].style.cssText = "width: 8px;height: 8px;background: rgba(255,255,255,.4)";
      });

      // 改变
      sliderWrapper[i].style.opacity = 1;
      sliderWrapper[i].style.zIndex = 1;
      // 改变和i相关的属性 
      sliderIndicators[i].style.cssText = 'width: 9px;height: 9px;background: #ffff';
    }
    function motain() {
      timer = setInterval(function () {
        id += 1;
        if (id === 8) {
          id = 0;
        }
        test(id);
      }, 3000);
    }
    // 按钮移入事件
    function buttonMotain() {
      var _loop = function _loop(i) {
        // 给sliderIndicators添加移入事件
        sliderIndicators[i].onmouseover = function () {
          // 当移入的时候改变id的指向,停止定时器
          clearInterval(timer);
          // 改变id 
          id = i;
          test(i);
          setTimeout(function () {
            clearInterval(timer);
            motain();
          }, 1000);
        };
      };

      // 通过for循环来遍历元素
      for (var i = 0; i < sliderIndicators.length; i++) {
        _loop(i);
      }
    }
    function buttonClick() {
      // 给左侧buttonLeft添加点击事件
      buttonLeft.onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 让id相减
        id -= 1;
        // 判断一下边界值,如果id超过了0的话,
        if (id === -1) {
          id = 7;
        }
        test(id);
        setTimeout(function () {
          clearInterval(timer);
          motain();
        }, 2000);
      };
      // 给右侧buttonLeft添加点击事件
      buttonRight.onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 判断边界值,如果id > 7
        id += 1;
        if (id === 8) {
          id = 0;
        }
        test(id);
        // 通过定时器延迟加载
        setTimeout(function () {
          clearInterval(timer);
          motain();
        }, 2000);
      };
    }
    function sliderOver() {
      sliderList.onmouseover = function () {
        // 停止定时器
        clearInterval(timer);
      };
      sliderList.onmouseleave = function () {
        clearInterval(timer);
        motain();
      };
    }
    motain();
    buttonMotain();
    buttonClick();
    sliderOver();
  })();
}; /*中间行为*/

exports.middleNavRight = function () {
  (function () {
    // 拿到左边的button和右边的button
    var buttonLeft = document.getElementsByClassName('slider_control_prev')[1];
    // 拿到右边的button
    var buttonRight = document.getElementsByClassName('slider_control_next')[1];
    // 拿到slider_wrapper
    var sliderWrapper1 = document.getElementsByClassName('slider_wrapper')[1];
    // 定义一个timer,和id来通过定时器来计算
    var timer = void 0,
        id = 0;
    // 拿到sliderWrapper1中的children
    var wrapper = sliderWrapper1.children;
    // 定义数组
    var arr = [0, 1, 2];
    function monitorId(id) {
      // 过滤数组中和id不相干的值
      var toArr = (0, _index.filterArr)(arr, id);
      toArr.map(function (ele) {
        wrapper[ele].style.opacity = 0;
        wrapper[ele].style.zIndex = 0;
      });
      wrapper[id].style.opacity = 1;
      wrapper[id].style.zIndex = 1;
    }
    function wrapperOver() {
      // 给sliderWrapper1添加移入事件
      document.getElementsByClassName('slider_list')[1].onmouseover = function () {
        // 显示buttonLeft和buttonRight
        buttonLeft.style.display = 'block';
        buttonRight.style.display = 'block';
      };
      // 给sliderWrapper1添加点击事件
      sliderWrapper1.onmouseover = function () {
        // 停止定时器
        clearInterval(timer);
      };
      // 当sliderWrapper移出的时候
      sliderWrapper1.onmouseleave = function () {
        // 清空累加器
        clearInterval(timer);
        // 让button隐藏
        buttonLeft.style.display = 'none';
        buttonRight.style.display = 'none';
        setId();
      };
    }
    function setId() {
      timer = setInterval(function () {
        id += 1;
        if (id === 3) {
          id = 0;
        }
        monitorId(id);
      }, 8000);
    }
    function buttonClick() {
      // 给buttonLeft添加点击事件
      buttonLeft.onclick = function (event) {
        // 停止定时器
        clearInterval(timer);
        // 阻止默认事件
        event.stopPropagation();
        id -= 1;
        if (id === -1) {
          id = 2;
        }
        setTimeout(function () {
          clearInterval(timer);
          setId();
        }, 2000);
        monitorId(id);
      };
      // 给右侧点击添加事件
      buttonRight.onclick = function (event) {
        // 停止定时器
        clearInterval(timer);
        // 阻止默认事件
        event.stopPropagation();
        id += 1;
        if (id === 3) {
          id = 0;
        }
        setTimeout(function () {
          clearInterval(timer);
          setId();
        }, 2000);
        monitorId(id);
      };
    }
    wrapperOver();
    setId();
    buttonClick();
  })();
};

exports.middleRight = function () {
  (function () {
    // 拿到service_list中的children
    var serviceItem = document.getElementsByClassName('service_list')[0].children;
    // 拿到service_txt中的文本
    var serviceText = document.getElementsByClassName('service_txt');
    // 拿到hover的img标签
    var serviceImgHover = document.getElementsByClassName('service_ico_img_hover');
    // 定义数组
    var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    // 显示hover的图片
    function showHover(index) {
      // 通过移入事件来显示index
      var toArr = (0, _index.filterArr)(arr, index);
      // 隐藏和index没有关系的东西
      toArr.map(function (ele) {
        serviceImgHover[ele].style.opacity = 0;
        serviceText[ele].style.color = 'block';
      });
      // 改变和serviceImgHover和i相关的元素
      serviceImgHover[index].style.opacity = 1;
      serviceText[index].style.color = '#e1251b';
    }
    function serviceItemClick() {
      var _loop2 = function _loop2(i) {
        serviceItem[i].onmouseover = function () {
          showHover(i);
        };
        serviceItem[i].onmouseleave = function () {
          arr.map(function (ele) {
            serviceText[ele].style.color = 'black';
            serviceImgHover[ele].style.opacity = 0;
          });
        };
      };

      // 通过for循环来处理结果
      for (var i = 0; i < serviceItem.length; i++) {
        _loop2(i);
      }
    }
    serviceItemClick();
  })();
};
},{"./index":4}],3:[function(require,module,exports){
'use strict';

/* 中间搜索框*/
exports.searchRandom = function () {
  (function () {
    // 拿到搜索框
    var form = document.getElementsByClassName('form')[0];
    // 拿到form中的框
    var text = form.getElementsByClassName('text')[0];
    // 定义随机数
    var arr = ['欧米茄', '行车记录仪高清', '5G好物盛典', '路由器', '地球仪', '爱普生打印机', '云南白药牙膏', '格力变频空调', '澳柯玛冰柜', '好孩子婴儿推车'];
    // 定义计时器
    var timer = null;
    // 定义一个funcgtion
    function start() {
      timer = setInterval(function () {
        // 开启随机数
        var target = parseInt(Math.random() * arr.length);
        // 改变搜索框中的内容
        text.setAttribute('placeholder', arr[target]);
      }, 4000);
    }
    // 当搜索框点击的时候停止定时器
    text.onclick = function (event) {
      // 阻止默认事件
      event.stopPropagation();
      // 停止定时器
      clearInterval(timer);
    };
    // 当text离开的时候给body添加点击事件
    text.onmouseleave = function () {
      // 给body添加点击事件
      document.getElementsByTagName('body')[0].onclick = function (event) {
        // 阻止默认事件
        event.stopPropagation();
        // 因为定时器会有累计效果,所以要先清除累加器
        clearInterval(timer);
        start();
      };
    };
    start();
  })();
};
/*导出导航栏在东西*/
exports.navBtnRandom = function () {
  // 拿到style-red元素
  var styleRed = document.getElementById('specHotWord');
  // 定时器的标记
  var timer = null;
  // 定义一个定时器方法
  function start() {
    timer = setInterval(function () {
      if (styleRed.innerText === '阅读伴成长') {
        // 改变文本
        styleRed.innerText = '家电超级五';
      } else {
        styleRed.innerText = '阅读伴成长';
      }
    }, 2000);
  }
  // 当styleRed移入的时候
  styleRed.onmouseover = function () {
    // 停止定时器
    clearInterval(timer);
  };
  // 当styleRed移出的时候
  styleRed.onmouseleave = function () {
    // 重新开启定时器
    clearInterval(timer);
    start();
  };
  start();
};
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var filterArr = exports.filterArr = function filterArr(arr, index) {
    var filterArr = arr.filter(function (value) {
        return index !== value;
    });
    return filterArr;
};
},{}],5:[function(require,module,exports){
'use strict';

var _shortcut = require('./shortcut');

var _header = require('./header');

var _center = require('./center');

var _bottom = require('./bottom');

(0, _shortcut.shortcutLeft)();
(0, _header.searchRandom)();
(0, _header.navBtnRandom)();
(0, _center.middleNavImage)();
(0, _center.middleNavRight)();
(0, _center.middleRight)();
(0, _bottom.bottomSeckill)();
(0, _bottom.bottomSlider)();
(0, _bottom.bottomWrapper)();
(0, _bottom.boxHdArrow)();
(0, _bottom.boxBottomOver)();
(0, _bottom.logoHover)();
},{"./bottom":1,"./center":2,"./header":3,"./shortcut":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shortcutLeft = undefined;

var _index = require('./index');

// 导出一个导航栏左侧的行为
var shortcutLeft = exports.shortcutLeft = function shortcutLeft() {
  (function () {
    // 拿到左侧的导航栏
    var fl = document.getElementsByClassName('fl')[0];
    // 拿到左侧的导航栏的里面的shortcut_btn元素
    var shortcutBtn = fl.getElementsByClassName('shortcut_btn')[0];
    // 拿到需要改变的text文本
    var uiCityText = shortcutBtn.getElementsByClassName('ui-areamini-text')[0];
    // 拿到dropdown-layer
    var dropdownLayer = fl.getElementsByClassName('dropdown-layer')[0];
    // 拿到dropdown-layer中的item元素
    var dropdownLayerItem = document.getElementsByClassName('ui-areamini-content-list')[0].children;
    var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
    // 监听fl移入和移出的事件
    function flOnmouseOver() {
      // 当fl移入的时候显示dropdown-layer
      fl.onmouseover = function () {
        dropdownLayer.style.display = 'block';
      };
      // 当fl移出的时候隐藏dropdown-layer
      fl.onmouseleave = function () {
        dropdownLayer.style.display = 'none';
      };
    }
    // 遍历所有的dropdownLayerItem的坐标,并添加行为
    function itemClick() {
      // 通过for循环来遍历所有的数组并添加点击事件 setAttribute removeAttribute
      var manyA = [];

      var _loop = function _loop(i) {
        manyA.push(dropdownLayerItem[i].getElementsByTagName('a')[0]);
        // 给dropdownLayerItem添加点击事件
        dropdownLayerItem[i].onclick = function (event) {
          // 阻止事件冒泡
          event.stopPropagation();
          var arrMap = (0, _index.filterArr)(arr, i);
          arrMap.map(function (ele) {
            manyA[ele].removeAttribute('class');
          });
          // 改变和i相关的样式
          manyA[i].setAttribute('class', 'selected');
          // 让many[i].innerText等于 uiCityText
          uiCityText.innerText = manyA[i].innerText;
          // 更改this.style.backgroundColor
          this.style.backgroundColor = '#fff';
          // 关闭dropdownLayer
          dropdownLayer.style.display = 'none';
        };
        // 给dropdownLayerItem添加移入事件
        dropdownLayerItem[i].onmouseover = function (event) {
          // 拿到自己的子元素
          var a = this.getElementsByTagName('a')[0];
          var getDate = a.getAttribute('class');
          // 如果有的话就不干事情
          if (getDate) {
            return;
          }
          // 添加移入属性样式
          var arrMap = (0, _index.filterArr)(arr, i);
          arrMap.map(function (ele) {
            dropdownLayerItem[ele].style.backgroundColor = '#fff';
          });
          // 更改和i相关的样式
          this.style.backgroundColor = '#f4f4f4';
        };
      };

      for (var i = 0; i < dropdownLayerItem.length; i++) {
        _loop(i);
      }
    }
    flOnmouseOver();
    itemClick();
  })();
}; // 工具包
},{"./index":4}]},{},[5]);
