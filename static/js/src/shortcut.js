// 工具包
import {filterArr} from './index'
// 导出一个导航栏左侧的行为
export const shortcutLeft = () => {
  (function(){
    // 拿到左侧的导航栏
    const fl = document.getElementsByClassName('fl')[0];
    // 拿到左侧的导航栏的里面的shortcut_btn元素
    const shortcutBtn = fl.getElementsByClassName('shortcut_btn')[0];
    // 拿到需要改变的text文本
    const uiCityText = shortcutBtn.getElementsByClassName('ui-areamini-text')[0];
    // 拿到dropdown-layer
    const dropdownLayer = fl.getElementsByClassName('dropdown-layer')[0];
    // 拿到dropdown-layer中的item元素
    const dropdownLayerItem = document.getElementsByClassName('ui-areamini-content-list')[0].children;
    const arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34];
    // 监听fl移入和移出的事件
    function flOnmouseOver() {
      // 当fl移入的时候显示dropdown-layer
      fl.onmouseover = function() {
        dropdownLayer.style.display = 'block';
      }
      // 当fl移出的时候隐藏dropdown-layer
      fl.onmouseleave = function() {
        dropdownLayer.style.display = 'none';
      }
    }
    // 遍历所有的dropdownLayerItem的坐标,并添加行为
    function itemClick() {
      // 通过for循环来遍历所有的数组并添加点击事件 setAttribute removeAttribute
      let manyA = [];
      for(let i = 0; i < dropdownLayerItem.length; i++) {
        manyA.push(dropdownLayerItem[i].getElementsByTagName('a')[0]);
        // 给dropdownLayerItem添加点击事件
        dropdownLayerItem[i].onclick = function(event) {
          // 阻止事件冒泡
          event.stopPropagation();
          let arrMap = filterArr(arr,i);
          arrMap.map(ele => {
            manyA[ele].removeAttribute('class');
          });
          // 改变和i相关的样式
          manyA[i].setAttribute('class','selected');
          // 让many[i].innerText等于 uiCityText
          uiCityText.innerText = manyA[i].innerText;
          // 更改this.style.backgroundColor
          this.style.backgroundColor = '#fff';
          // 关闭dropdownLayer
          dropdownLayer.style.display = 'none';
        }
        // 给dropdownLayerItem添加移入事件
        dropdownLayerItem[i].onmouseover = function(event) {
          // 拿到自己的子元素
          let a = this.getElementsByTagName('a')[0];
          let getDate = a.getAttribute('class');
          // 如果有的话就不干事情
          if(getDate) {
            return;
          } 
          // 添加移入属性样式
          let arrMap = filterArr(arr,i);
          arrMap.map(ele => {
            dropdownLayerItem[ele].style.backgroundColor = '#fff';
          });
          // 更改和i相关的样式
          this.style.backgroundColor = '#f4f4f4';
        }
      }
    }
    flOnmouseOver();
    itemClick();
  }());
}