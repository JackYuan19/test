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
        } else if(date.hours() >= 8 && date.hours() < 10) {
          var afterTimer=+new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 10:00:00`);
          touch = '10:00';
        } else if(date.hours() >= 10 && date.hours() < 12) {
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