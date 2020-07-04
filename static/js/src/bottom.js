import {filterArr} from './index'
exports.bottomSeckill = () => {
  (function(){
    // 拿到countdown-desc中的strong
    const strong = document.getElementsByClassName('countdown-desc')[0].children;
    // 拿到timmer__unit--hour中的元素
    const timmer_unit_hours = document.getElementsByClassName('timmer__unit--hour')[0];
    // 拿到timmer__unit--minute中的元素
    const timmer_unit_minute = document.getElementsByClassName('timmer__unit--minute')[0];
    // 拿到timmer__unit--second中的元素
    const timmer__unit_second = document.getElementsByClassName('timmer__unit--second')[0];
    // 获取时间的
    function getDate() {
      // 判断时间戳
      var date = new Date();
      var minute,secode,hours,touch;
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
      let timerid = setInterval(() => {
        if(date.getHours() >= 14 && date.getHours() < 16) {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 16:00:00`);
          touch = '16:00';
        } else if(date.getHours() >= 16 && date.getHours() < 18) {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 18:00:00`);
          touch = '18:00';
        } else if(date.getHours() >= 18 && date.getHours() < 20) {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 20:00:00`);
          touch = '20:00';
        } else if(date.getHours() >= 20 && date.getHours() < 22) {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 22:00:00`);
          touch = '22:00';
        } else if(date.getHours() >= 8 && date.getHours() < 10) {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 10:00:00`);
          touch = '10:00';
        } else if(date.getHours() >= 10 && date.getHours() < 12) {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 12:00:00`);
          touch = '12:00';
        } else {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1} 8:00:00`);
          touch = '08:00';
        }
        let timer = (afterTimer - new Date()) / 1000;
        hours = Math.floor(timer/60/60%24);
        minute = Math.floor(timer/60%60);
        secode = Math.floor(timer%60);
        timmer_unit_hours.innerText = hours;
        timmer_unit_minute.innerText = minute;
        timmer__unit_second.innerText = secode;
        strong[0].innerText = touch;
      },1000);
    } 
    getDate();
  }());
}
exports.bottomSlider = () => {
  (function(){
    // 拿到slider_wrapper中的元素
    var sliderWrapper = document.getElementsByClassName('slider_wrapper')[2];
    // 拿到slider_control_prev中的元素
    var sliderControlPrev = document.getElementsByClassName('slider_control_prev')[2];
    // 拿到slider_control_next中的元素
    var sliderControlPNext = document.getElementsByClassName('slider_control_next')[2];
    let speed = 0,timer = null;
    function start() {
      // 定时器移动
      timer = setInterval(() => {
        if(speed === -3200) {
          speed = 0;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`;
        } else {
          speed -= 800;
          sliderWrapper.style.transition = 'all 500ms ease 0s';
          sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`;
          setTimeout(() => {
            sliderWrapper.style.transition = 'none 0s ease 0s';
          },500); 
        }
      },8000);
    }
    function wrapper(speed) {
      sliderWrapper.style.transition = 'all 500ms ease 0s';
      sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`
      setTimeout(() => {
        clearInterval(timer);
        sliderWrapper.style.transition = 'none 0s ease 0s';
        start();
      },2000);
    }
    function startClick() {
      sliderControlPrev.addEventListener('click',function() {
        // 停止定时器
        clearInterval(timer);
        if(speed >= 0) {
          speed = -3200; 
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`;
          return;
        } else {
          speed += 800;
        }
        wrapper(speed);
      });
      sliderControlPNext.addEventListener('click',function() {
        clearInterval(timer);
        if(speed === -3200) {
          speed = 0;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`;
          return;
        } else {
          speed -= 800;
        }
        wrapper(speed);
      });
    }
    function wrapperMouse() {
      sliderWrapper.addEventListener('mouseover',function() {
        clearInterval(timer);
      });
      sliderWrapper.addEventListener('mouseleave',function() {
        clearInterval(timer);
        start();
      })
    }
    start();
    startClick();
    wrapperMouse();
  }())
}
exports.bottomWrapper = () => {
  (function(){
    // 拿到slider_wrapper元素
    const sliderWrapper = document.getElementsByClassName('slider_wrapper')[3];
    // 拿到button按钮slider_indicators_btn 
    const sliderIndicatorsBtn = document.getElementsByClassName('slider_indicators_btn');
    // 定义speed
    let speed = 0,timer = null;
    //sliderWrapper.style.transition = '500ms ease-in-out 0s';
    //sliderWrapper.style.transform = "translate3d(-180px, 0px, 0px)";
    function start() {
      timer = setInterval(() => {
        if(speed === -540) {
          speed = -180;
          sliderWrapper.style.transition = 'none 0s ease 0s';
          sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`;
        } else {
          speed += -180;
          if(speed === -360) {
            sliderIndicatorsBtn[8].setAttribute('class','slider_indicators_btn slider_indicators_btn_active');
            sliderIndicatorsBtn[9].setAttribute('class','slider_indicators_btn');
          } else {
            sliderIndicatorsBtn[9].setAttribute('class','slider_indicators_btn slider_indicators_btn_active');
            sliderIndicatorsBtn[8].setAttribute('class','slider_indicators_btn');
          }
          sliderWrapper.style.transition = '500ms ease-in-out 0s';
          sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`;
          setTimeout(() => {
            sliderWrapper.style.transition = 'none 0s ease 0s';
          },500);
        }
      },2000);
    }
    function stopSlider(index,speed) {
      sliderWrapper.style.transition = '500ms ease-in-out 0s';
      sliderWrapper.style.transform = `translate3d(${speed}px, 0px, 0px)`;
      if(index === 0) {
        sliderIndicatorsBtn[8].setAttribute('class','slider_indicators_btn slider_indicators_btn_active');
        sliderIndicatorsBtn[9].setAttribute('class','slider_indicators_btn');
      } else {
        sliderIndicatorsBtn[9].setAttribute('class','slider_indicators_btn slider_indicators_btn_active');
        sliderIndicatorsBtn[8].setAttribute('class','slider_indicators_btn');
      }
      setTimeout(() => {
        sliderWrapper.style.transition = 'none 0s ease 0s';
      },500);
      setTimeout(() => {
        clearInterval(timer);
        start();
      },1500);
    }
    // 给sliderIndicatorsBtn添加移入事件
    function sliderIndicatorsBtnOver() {
      sliderIndicatorsBtn[8].addEventListener('mouseover',function() {
        clearInterval(timer);
        if(speed === -180) {
          speed = 0;
        } else {
          speed = -360;
        }
        stopSlider(0,speed);
      });
      sliderIndicatorsBtn[9].addEventListener('mouseover',function() {
        clearInterval(timer);
        if(speed === 0) {
          speed = -180;
        } else {
          speed = -540;
        }
        stopSlider(1,speed);
      });
    }
    start();
    sliderIndicatorsBtnOver();
  }());
}
exports.boxHdArrow = () => {
 (function(){
   // 拿到元素
   const boxHdArrow = document.getElementsByClassName('box_hd_arrow1');
   for(let i = 0; i <boxHdArrow.length; i++) {
    boxHdArrow[i].addEventListener('mouseover',function() {
      this.setAttribute('class','box_hd_arrow1 box_hd_arrow');
    });
    boxHdArrow[i].addEventListener('mouseleave',function() {
      this.setAttribute('class','box_hd_arrow1');
    })
   }
 }())
}
exports.boxBottomOver = () => {
  (function(){
   // 拿到tab_body_item的元素
   const tabBodyItem = document.getElementsByClassName('tab_body_item');
   // 拿到tab_head_item的元素
   const tabHeadItem = document.getElementsByClassName('tab_head_item');
   const arr = [0,1,2,3,4]; 
   // 处理过滤结果
   function filterDom(index) {
     let manyArr = filterArr(arr,index);
     manyArr.map(ele => {
      tabBodyItem[ele].style.display = 'none';
      tabHeadItem[ele].setAttribute('class','tab_head_item');
     });
     // 改变和index相等的DOM元素
     tabHeadItem[index].setAttribute('class','tab_head_item active');
     tabBodyItem[index].style.display = 'block';
   }
   for(let i = 0; i < tabHeadItem.length; i++) {
     tabHeadItem[i].addEventListener('mouseover',function() {
       filterDom(i);
     });
   }
  }());
}

exports.logoHover = () => {
  (function(){
    // 拿到元素
    const logoTextChildren = document.getElementsByClassName('logo-text')[0].children[0];
    // 拿到元素
    const scrollPoints = document.getElementsByClassName('scroll-points')[0];
    const goodsList = document.getElementsByClassName('goods-list')[0];
    const niceGoodsNiceRecommends = document.getElementsByClassName('nice-goods__recommends')[0];
    const scrollBar = document.getElementsByClassName('scroll-bar')[0];
    let speed = 0,sliderSpeed = 0,timer;
    // 拿到nice-goods__logo
    const niceGoodsLogo = document.getElementsByClassName('nice-goods__logo')[0];
    function mouseOver() {
      niceGoodsLogo.addEventListener('mouseover',function() {
        logoTextChildren.setAttribute('class','logo-text_show');
        scrollBar.style.opacity = 1;
        clearInterval(timer);
      });
      niceGoodsLogo.addEventListener('mouseleave',function() {
        logoTextChildren.removeAttribute('class');
        scrollBar.style.opacity = 0;
        clearInterval(timer);
        slider();
      });
    }
    function slider() {
      timer = setInterval(() => {
        if(speed < -1020 || sliderSpeed > 860) {
          speed = 0;
          sliderSpeed = 0;
          goodsList.style.transform = `translate3d(${speed}px,0,0)`;
          scrollPoints.style.left = sliderSpeed + 'px';
        } else {
          speed += -20.4;
          sliderSpeed += 17.2;
          goodsList.style.transform = `translate3d(${speed}px,0,0)`;
          scrollPoints.style.left = sliderSpeed + 'px'; 
        }
      },1000);
    }
    function sliderMove() {
      scrollPoints.addEventListener('mousedown',function(event) {
        let e = event || window.event;
        let offset = e.clientX - this.offsetLeft;
        document.onmousemove = (event) => {
          clearTimeout(timer);
          let e = event || window.event;
          let x = e.clientX - offset;
          if(x <= 0) {
            sliderSpeed = 0,speed = 0;
            this.style.left = 0 + 'px';
            goodsList.style.transform = `translate3d(0px,0,0)`;
            return;
          } else if(x >= 861) {
            sliderSpeed = 861,speed = -1020;
            this.style.left = 861 + 'px';
            goodsList.style.transform = `translate3d(-1020px,0,0)`;
            return;
          } else {
            if(x > sliderSpeed) { //  代表是往右边走的
              sliderSpeed = x;
              //console.log(speed);
              speed -= 28 * 0.1;
              goodsList.style.transform = `translate3d(${speed}px,0,0)`;
            } else { // 代表往左边走到
              sliderSpeed = x;
              speed += 25 * 0.1;
              goodsList.style.transform = `translate3d(${speed}px,0,0)`;
            }
            this.style.left = x + 'px';
          }
        }
        document.onmouseup = function() {
          this.onmousemove = null;
          clearTimeout(timer);
          slider
        }
      });
    }
    function niceMove() {
      niceGoodsNiceRecommends.addEventListener('mouseover',() => {
        // 显示scrollBar
        scrollBar.style.opacity = 1;
        // 停止定时器
        clearInterval(timer);
      });
      niceGoodsNiceRecommends.addEventListener('mouseleave',() => {
         // 显示scrollBar
         scrollBar.style.opacity = 0;
         // 停止定时器
         clearInterval(timer);
         slider();
      })
    }
    mouseOver();
    slider();
    sliderMove();
    niceMove();
  }())
}

exports.newArrival = () => {
  (function() {
    // 拿到newArrival_item_msg
    const newArrivalItemMsg = document.getElementsByClassName('newArrival_item_msg');
    // 拿到newArrival_item_name
    const newArrivalItemName = document.getElementsByClassName('newArrival_item_name');
    // 拿到newArrival_item_desc
    const newArrivalItemDesc = document.getElementsByClassName('newArrival_item_desc');
    // 拿到newArrival_item
    const newArrivalItem = document.getElementsByClassName('newArrival_item');
    // 拿到wrapper
    const wrapper = document.getElementsByClassName('slider_wrapper')[4];
    // 拿到左侧button按钮和右侧button按钮
    const sliderControlPrev = document.getElementsByClassName('slider_control_prev')[3];
    const sliderControlNext = document.getElementsByClassName('slider_control_next')[3];
    let timer = null,speed = 0,value = 1,arr = [0,1,2,3,4,5,6,7,8,9];
    // 定义一个记录
    // 初始值
    function inittializeValue() {
      newArrivalItem[1].setAttribute('class','slider_item newArrival_item slider_active middleSlide');
      newArrivalItemMsg[1].setAttribute('class','newArrival_item_msg newArrival_item_msgActive');
      newArrivalItemDesc[1].setAttribute('class','newArrival_item_desc newArrival_item_descActive');
      newArrivalItemName[1].setAttribute('class','newArrival_item_name newArrival_item_nameActive');
    }
    // 开启定时器
    function sliderSpeed(speed,index) {
      let toArr = filterArr(arr,index);
      toArr.map(ele => { // 更改和index不相关的标签
        newArrivalItem[ele].setAttribute('class','slider_item newArrival_item');
        newArrivalItemMsg[ele].setAttribute('class','newArrival_item_msg');
        newArrivalItemDesc[ele].setAttribute('class','newArrival_item_desc');
        newArrivalItemName[ele].setAttribute('class','newArrival_item_name ');
      });
      // 改变transition
      
      // 设置和index相关的样式
      newArrivalItem[index].setAttribute('class','slider_item newArrival_item slider_active middleSlide');
      wrapper.style.transform = `translate3d(${speed}px,0,0)`;
      newArrivalItemMsg[index].setAttribute('class','newArrival_item_msg newArrival_item_msgActive');
      newArrivalItemDesc[index].setAttribute('class','newArrival_item_desc newArrival_item_descActive');
      newArrivalItemName[index].setAttribute('class','newArrival_item_name newArrival_item_nameActive');
    }
    function setSlider() {
      // 开启定时器
      timer = setInterval(() => {
        // 判断边界值
        if(speed === -910) {
          speed = 0;
          value = 1;
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
        } else {
          speed += -130;
          value += 1;
          // 移动transition
          wrapper.style.transition = 'transform 500ms ease-in-out 0s';
          setTimeout(() => {
            wrapper.style.transition = 'none 0s ease 0s';
          },500);
        }
        sliderSpeed(speed,value);
      },3000);
    }
    function setClick() {
      //sliderControlPrev给左侧按钮添加点击事件
      sliderControlPrev.onclick = function(event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 判断一次speed的边界值
        if(speed >= 0) {
          speed = -390;
          value = 4;
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
        } else {
          speed += 130;
          value -= 1;
          // 移动transition
          wrapper.style.transition = 'transform 500ms ease-in-out 0s';
        }
        // 调用方法
        sliderSpeed(speed,value);
        // 通过setTimeout来开启定时器
        setTimeout(() => {
          clearInterval(timer);
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
          setSlider();
        },2000);
      }
      // 给右侧添加点击事件
      sliderControlNext.onclick = function(event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 让speed减减,value+= 1;
        // 判断speed的边界值
        if(speed <= -910) {
          speed = 0;
          value = 1;
          // 移动transition
          wrapper.style.transition = 'none 0s ease 0s';
        } else {
          speed -= 130;
          value += 1;
          // 移动transition
          wrapper.style.transition = 'transform 500ms ease-in-out 0s';
        }
         // 调用方法
         sliderSpeed(speed,value);
         // 通过setTimeout来开启定时器
         setTimeout(() => {
           clearInterval(timer);
           // 移动transition
           wrapper.style.transition = 'none 0s ease 0s';
           setSlider();
         },2000);
      }
    }
    inittializeValue();
    setSlider();
    setClick();
  }());
}

exports.newTopInner = () => {
  (function(){
    // 难道元素tab_head[1]中在子元素
    const tabHeadItem = document.getElementsByClassName('tab_head')[1].children;
    // 拿到tab_body_item1中的元素
    const tabBodyItem = document.getElementsByClassName('tab_body_item1');
    // 数组
    const arr = [0,1,2,3];
    // 设置初始值
    function inittialize() {
      // 设置tabHeadItem中的数组0的class
      tabHeadItem[0].setAttribute('class','tab_head_item1 active');
    }
    // 写一个方法,来实现tabBodyItem移入事件
    function tabBodyClick() {
      // 通过for循环来给每一个tabHeadItem添加移入事件
      for(let i = 0; i < tabHeadItem.length;i++) {
        tabHeadItem[i].addEventListener('mouseover',function() {
         
          // 通过直接域中i来改变和arr不相干值
          
          let toArr = filterArr(arr,i);
          toArr.map(ele => {
            tabHeadItem[ele].setAttribute('class','tab_head_item1');
            tabBodyItem[ele].style.display = 'none';
          });
          // 改变和i相关的元素
          tabBodyItem[i].style.display = 'block';
          this.setAttribute('class','tab_head_item1 active');
        });
      }
    }
    inittialize();
    tabBodyClick();
  }());
}