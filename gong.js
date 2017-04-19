   var map;
   try {
       if (typeof (navigator.geolocation) == 'undefined') {
           alert(1);
           map = google.gears.factory.create('beta.mapocation');
       } else {
           console.log(navigator);
           alert(2);
           map = navigator.geolocation;
       }
   } catch (error) {
       //alert(error.message);  
   }

   if (map) {
       map.getCurrentPosition(function (position) {
           alert(position);
           var nowLatitude = position.coords.latitude;
           var nowLongitude = position.coords.longitude;

           alert('纬度：' + nowLatitude + '， 经度：' + nowLongitude);
       }, function (error) {
           switch (error.code) {
           case error.TIMEOUT:
               alert('连接超时，请重试');
               break;
           case error.PERMISSION_DENIED:
               alert('您拒绝了使用位置共享服务，查询已取消');
               break;
           case error.POSITION_UNAVAILABLE:
               alert('非常抱歉，我们暂时无法通过浏览器获取您的位置信息');
               break;
           }
       }, {
           timeout: 10000
       }); //设置十秒超时  
   }