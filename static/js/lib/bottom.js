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