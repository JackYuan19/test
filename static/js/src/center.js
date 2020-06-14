/*中间行为*/
import {filterArr} from './index'
exports.middleNavImage = () => {
  (function(){
    // 引入slider_wrapper中的li
    const sliderWrapper = document.getElementsByClassName('slider_wrapper')[0].children;
    // 引入slider_indicators中的i
    const sliderIndicators = document.getElementsByClassName('slider_indicators')[0].children;
    // 拿到左侧点击按钮slider_control_prev
    const buttonLeft = document.getElementsByClassName('slider_control_prev')[0];
    // 拿到右侧点击按钮
    const buttonRight = document.getElementsByClassName('slider_control_next')[0];
    // 拿到sliderBannerWrapper元素
    const sliderList = document.getElementsByClassName('slider_list')[0];
    let id = 0,timer;
    let arr = [0,1,2,3,4,5,6,7];
    function test(i) {
      let toArr = filterArr(arr,i);
      toArr.map(ele => {
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
      timer = setInterval(() => {
        id += 1;
        if(id === 8) {
          id = 0;
        }
        test(id);
      },3000); 
    }
    // 按钮移入事件
    function buttonMotain() {
      // 通过for循环来遍历元素
      for(let i = 0; i < sliderIndicators.length; i++) {
        // 给sliderIndicators添加移入事件
        sliderIndicators[i].onmouseover = function() {
          // 当移入的时候改变id的指向,停止定时器
          clearInterval(timer);
          // 改变id 
          id = i;
          test(i);
          setTimeout(() => {
            clearInterval(timer);
            motain();
          },1000);
        }
      }
    }
    function buttonClick() {
      // 给左侧buttonLeft添加点击事件
      buttonLeft.onclick = function(event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 让id相减
        id -= 1;
        // 判断一下边界值,如果id超过了0的话,
        if(id === -1) {
          id = 7;
        }
        test(id);
        setTimeout(() => {
          clearInterval(timer);
          motain(); 
        },2000);
      }
      // 给右侧buttonLeft添加点击事件
      buttonRight.onclick = function(event) {
        // 阻止默认事件
        event.stopPropagation();
        // 停止定时器
        clearInterval(timer);
        // 判断边界值,如果id > 7
        id += 1;
        if(id === 8) {
          id = 0;
        } 
        test(id);
        // 通过定时器延迟加载
        setTimeout(() => {
          clearInterval(timer);
          motain(); 
        },2000);
      }
    }
    function sliderOver() {
      sliderList.onmouseover = function() {
        // 停止定时器
        clearInterval(timer);
      }
      sliderList.onmouseleave = function() {
        clearInterval(timer);
        motain();
      }
    }
    motain();
    buttonMotain();
    buttonClick();
    sliderOver();
  }());
}
exports.middleNavRight = () => {
  (function() {
    // 拿到左边的button和右边的button
    const buttonLeft = document.getElementsByClassName('slider_control_prev')[1];
    // 拿到右边的button
    const buttonRight = document.getElementsByClassName('slider_control_next')[1];
    // 拿到slider_wrapper
    const sliderWrapper1 = document.getElementsByClassName('slider_wrapper')[1];
    // 定义一个timer,和id来通过定时器来计算
    let timer, id = 0;
    // 拿到sliderWrapper1中的children
    const wrapper = sliderWrapper1.children;
    // 定义数组
    const arr = [0,1,2];
    function monitorId(id) {
      // 过滤数组中和id不相干的值
      let toArr = filterArr(arr,id);
      toArr.map(ele => {
        wrapper[ele].style.opacity = 0;
        wrapper[ele].style.zIndex = 0;
      });
      wrapper[id].style.opacity = 1;
      wrapper[id].style.zIndex = 1;
    }
    function wrapperOver() {
      // 给sliderWrapper1添加移入事件
      document.getElementsByClassName('slider_list')[1].onmouseover = function() {
        // 显示buttonLeft和buttonRight
        buttonLeft.style.display = 'block';
        buttonRight.style.display = 'block';
      }
      // 给sliderWrapper1添加点击事件
      sliderWrapper1.onmouseover = function() {
        // 停止定时器
        clearInterval(timer);
      }
      // 当sliderWrapper移出的时候
      sliderWrapper1.onmouseleave = function() {
        // 清空累加器
        clearInterval(timer);
        // 让button隐藏
        buttonLeft.style.display = 'none';
        buttonRight.style.display = 'none';
        setId();
      }
    }
    function setId() {
      timer = setInterval(() => {
       id += 1;
       if(id === 3) {
         id = 0;
       }
       monitorId(id);
      },8000);
    }
    function buttonClick() {
      // 给buttonLeft添加点击事件
      buttonLeft.onclick = function(event) {
        // 停止定时器
        clearInterval(timer);
        // 阻止默认事件
        event.stopPropagation();
        id -= 1;
        if(id === -1) {
          id = 2;      
        }
        setTimeout(() => {
          clearInterval(timer);
          setId();
        },2000);
        monitorId(id);
      }
      // 给右侧点击添加事件
      buttonRight.onclick = function(event) {
        // 停止定时器
        clearInterval(timer);
        // 阻止默认事件
        event.stopPropagation();
        id += 1;
        if(id === 3) {
          id = 0;
        }
        setTimeout(() => {
          clearInterval(timer);
          setId();
        },2000);
        monitorId(id);
      }
    }
    wrapperOver();
    setId();
    buttonClick();
  }());
}

exports.middleRight = () => {
  (function() {
    // 拿到service_list中的children
    const serviceItem = document.getElementsByClassName('service_list')[0].children;
    // 拿到service_txt中的文本
    const serviceText = document.getElementsByClassName('service_txt');
    // 拿到hover的img标签
    const serviceImgHover = document.getElementsByClassName('service_ico_img_hover');
    // 定义数组
    const arr = [0,1,2,3,4,5,6,7,8,9,10,11];
    // 显示hover的图片
    function showHover(index) {
      // 通过移入事件来显示index
      let toArr = filterArr(arr,index);
      // 隐藏和index没有关系的东西
      toArr.map(ele => {
        serviceImgHover[ele].style.opacity = 0;
        serviceText[ele].style.color = 'block';
      });
      // 改变和serviceImgHover和i相关的元素
      serviceImgHover[index].style.opacity = 1;
      serviceText[index].style.color = '#e1251b';
    }
    function serviceItemClick() {
      // 通过for循环来处理结果
      for(let i = 0; i < serviceItem.length; i++) {
        serviceItem[i].onmouseover = function() {
          showHover(i);
        }
        serviceItem[i].onmouseleave = function() {
          arr.map(ele => {
            serviceText[ele].style.color = 'black';
            serviceImgHover[ele].style.opacity = 0;
          });
        }
      }
    }
    serviceItemClick();
  }());
}