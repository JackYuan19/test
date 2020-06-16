'use strict';

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
        } else {
          speed -= 400;
        }
        sliderWrapper.style.marginLeft = speed + 'px';
      }, 8000);
    }
    function wrapper(speed) {
      sliderWrapper.style.marginLeft = speed + 'px';
    }
    function startClick() {
      sliderControlPrev.addEventListener('click', function () {
        // 停止定时器
        clearInterval(timer);
        speed += 400;
        if (speed >= 0) {
          speed = -3200;
        }
        setTimeout(function () {
          clearInterval(timer);
          start();
        }, 2000);
        wrapper(speed);
      });
      sliderControlPNext.addEventListener('click', function () {
        clearInterval(timer);
        speed -= 400;
        if (speed === -3200) {
          speed = 0;
        }
        setTimeout(function () {
          clearInterval(timer);
          start();
        });
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