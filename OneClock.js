/**
 * @Version 1.0.1
 * @author Zachary_M
 * @date 2018.9.10
 * @brief
 *   本人写的第一个脚本，真"从0开始写js",写的稀烂,望多多体谅。
 *   该脚本是对app"oneClock"其中一个界面的实现,原app的翻页效果比较有趣，个人能力有限无法实现
 *   1.修改了布局相关的代码，尝试对iphonex屏幕尺寸做适配,
 *   2.添加了检测版本相关的代码
 *   双击更换主题
 * @/brief
 */
const version =1.01;
scriptVersionUpdate();

$app.idleTimerDisabled //禁用息屏
let checkVertical=function() {
  let orientation=$device.info["screen"]["orientation"]
  if(orientation==3||orientation==4){
    return false  
  }else if(orientation==1){
    return true
  }else{
    return $device.info["screen"]["width"].toString()<$device.info["screen"]["height"].toString()?true:false //手机平放时获取当前的屏幕状态
  }
}//获取屏幕当前朝向
if (checkVertical()){
  var screenWidth=$device.info["screen"]["width"]
  var screenHeight=$device.info["screen"]["height"]  
}else{
  var screenHeight=$device.info["screen"]["width"]
  var screenWidth=$device.info["screen"]["height"]
}
//获取屏幕信息
var isVertical=checkVertical()
var isIphoneX = $device.isIphoneX;
let timeFontSize = 180; //时钟的字体大小
let cardsDistance=40//卡片之间的距离
let cardLength=screenHeight-screenWidth-cardsDistance//卡片边长，暂时处理成正方形
cardLength=isIphoneX?cardLength-100:cardLength  //对iphonex的边长作调整
let cardSize = $size(cardLength, cardLength); //卡片大小
let edgeTop = (screenWidth-cardSize.width)/2; //卡片边距，此处top考虑横屏情况下的上下边距
let edgeLeft= (screenHeight-2*cardLength-cardsDistance)/2 //卡片边距，此处left考虑横屏情况下的左右边距
let blankBarPos = edgeTop + cardSize.height/2-3; //竖屏时上下卡片遮挡条的位置
let blankBarHeight = 5; //黑边遮挡条的宽度

var theme = "black";//默认黑色主题

let themeColor = {
  "white": {
    "bgColor": $color("#FFFFFF"),
    "viewColor": $color("#F2F2F2"),
    "textColor": $color("#000000")
  },
  "black": {
    "bgColor": $color("#000000"),
    "viewColor": $color("#191919"),
    "textColor": $color("#B8B8B8")
  }
};//主题配色

if (typeof $cache.get("theme") == "undefined") {
  theme = "black"; //默认主配色
} else {
  theme = $cache.get("theme");
}

let timeFormate = function(time) {
  if (time < 10) {
    return "0" + time.toString();
  } else {
    return time.toString();
  }
}; //时间字符串格式化输出

let labelHour = timeFormate(new Date().getHours()); //初始化小时数
let labelMinute = timeFormate(new Date().getMinutes()); //初始化分钟数

let apm = function(hour) {
  if (hour >= 12) {
    return "PM";
  } else {
    return "AM";
  }
}; //am,pm判断

main();
var timer = $timer.schedule({
  interval: 0.5,
  handler: function() {
    let date = new Date();
    let chour = timeFormate(date.getHours());
    let cminute = timeFormate(date.getMinutes());
    if ($("minutes").text != cminute || $("hours").text != chour) {
      // if ($("minutes").text != cminute){
      //   $ui.animate({
      //     duration: 0.2,
      //     animation: function() {
      //       $("minutesView").bgcolor=themeColor[theme=="black"?"white":"black"]["viewColor"]
      //     }
      //   });
      //   $delay(0.1, function() {
      //     $ui.animate({
      //       duration: 0.2,
      //       animation: function() {
      //         $("minutesView").bgcolor=themeColor[theme]["viewColor"]
      //         $("minutes").text = cminute;
      //       }
      //     });
      //   });
      // }
      $ui.animate({
        duration: 0.4,
        animation: function() {
          $("hours").text = chour;
          $("minutes").text = cminute;
          let capm=apm($("hours").text)
          if (capm != $("APMLabel").text) {
            $("APMLabel").text = capm;
            if (capm == "AM") {
              $("APMLabel").remakeLayout(function(make) {
                make.left.top.inset(20);
              });
            } else {
              $("APMLabel").remakeLayout(function(make) {
                make.left.bottom.inset(20);
              });
            }
          }
        }
      });
    }
    if(checkVertical()!=isVertical){
      isVertical=!isVertical;
      console.log("Vertical Changed")
      let tmp=edgeTop
      edgeLeft=edgeTop
      edgeTop=tmp
      blankBarPos = edgeTop + cardSize.height/2-3;
      $("blankBarHours").updateLayout(function(make) {
        make.top.inset(blankBarPos);
      });
      $("blankBarMinutes").updateLayout(function(make) {
        make.bottom.inset(blankBarPos);
      });
      $("hoursView").updateLayout(function(make) {
        make.top.inset(edgeTop);
        make.left.inset(edgeLeft);
        
      });
      $("minutesView").updateLayout(function(make) {
        make.bottom.inset(edgeTop);
        make.right.inset(edgeLeft);
      });
    }
  }
}); //定时任务，定时改变界面元素

function main() {
  $ui.render({
    props: {
      id: "background",
      navBarHidden: true,
      statusBarHidden: true,
      bgcolor: themeColor[theme]["bgColor"]
    },
    events: {
      doubleTapped: function(sender) {
        changeTheme();
      }
    },
    views: [
      {
        type: "view",
        props: {
          id: "hoursView",
          bgcolor: themeColor[theme]["viewColor"],
          smoothRadius: 20
        },
        layout: function(make, view) {
          make.top.inset(edgeTop);
          make.left.inset(edgeLeft);
          make.size.equalTo(cardSize);
        },

        views: [
          {
            type: "label",
            props: {
              id: "hours",
              text: labelHour,
              align: $align.center,
              textColor: themeColor[theme]["textColor"],
              font: $font("TimesNewRomanPS-BoldMT", timeFontSize)
            },
            layout: function(make, view) {
              make.center.equalTo(view.super);
            }
          },
          {
            type: "label",
            props: {
              id: "APMLabel",
              text: apm(labelHour),
              align: $align.center,
              textColor: themeColor[theme]["textColor"],
              font: $font(20)
            },
            layout: function(make, view) {
              if (apm($("hours").text) == "PM") {
                make.left.bottom.inset(20);
              } else {
                make.left.top.inset(20);
              }
            }
          }
        ]
      },
      {
        type: "view",
        props: {
          id: "minutesView",
          bgcolor: themeColor[theme]["viewColor"],
          smoothRadius: 20
        },
        layout: function(make, view) {
          make.bottom.inset(edgeTop);
          make.right.inset(edgeLeft);
          make.size.equalTo(cardSize);
        },
        views: [
          {
            type: "label",
            props: {
              id: "minutes",
              text: labelMinute,
              align: $align.center,
              textColor: themeColor[theme]["textColor"],
              font: $font("TimesNewRomanPS-BoldMT", timeFontSize)
            },
            layout: function(make, view) {
              make.center.equalTo(view.super);
            }
          }
        ]
      },
      {
        type: "view",
        props: {
          id: "blankBar",
          bgcolor: themeColor[theme]["bgColor"]
        },
        layout: function(make, view) {
          make.center.equalTo(view.super),
            make.width.equalTo(view.super.width),
            make.height.equalTo(blankBarHeight);
        }
      },
      {
        type: "view",
        props: {
          id: "blankBarHours",
          bgcolor: themeColor[theme]["bgColor"]
        },
        layout: function(make, view) {
          make.centerX.equalTo(view.super),make.top.inset(blankBarPos);
          make.width.equalTo(view.super.width),
            make.height.equalTo(blankBarHeight);
        }
      },
      {
        type: "view",
        props: {
          id: "blankBarMinutes",
          bgcolor: themeColor[theme]["bgColor"]
        },
        layout: function(make, view) {
          make.centerX.equalTo(view.super), make.bottom.inset(blankBarPos);
          make.width.equalTo(view.super.width),
            make.height.equalTo(blankBarHeight);
        }
      }
    ]
  });
}
let changeTheme = function() {
  if (theme == "black") {
    $cache.set("theme", "white");
  } else {
    $cache.set("theme", "black");
  }
  theme = $cache.get("theme");
  $("background").bgcolor = themeColor[theme]["bgColor"];
  $("blankBar").bgcolor = themeColor[theme]["bgColor"];
  $("blankBarHours").bgcolor = themeColor[theme]["bgColor"];
  $("blankBarMinutes").bgcolor = themeColor[theme]["bgColor"];
  $("hoursView").bgcolor = themeColor[theme]["viewColor"];
  $("minutesView").bgcolor = themeColor[theme]["viewColor"];
  $("hours").textColor = themeColor[theme]["textColor"];
  $("minutes").textColor = themeColor[theme]["textColor"];
  $("APMLabel").textColor = themeColor[theme]["textColor"];
  $device.taptic(1);
};//处理双击更换主题的事件


var isIpad = $device.isIpad;
var isIpadPro = $device.isIpadPro;
//屏幕检测
if (
  (isIphoneX  || isIpad || isIpadPro) &&
  typeof $cache.get("firstTime") == "undefined"
) {
  $ui.alert({
    title: "可能暂未适配您的分辨率",
    message:
      "个人能力有限，暂未对iphonex/plus、ipad(pro)的分辨率作布局适配\n您可以通过修改脚本中的参数自行调整界面",
    actions: [
      {
        title: "OK",
        handler: function() {
          $cache.set("firstTime", false);
        }
      },
      {
        title: "Exit",
        handler: function() {
          $app.close(0.5);
          $cache.set("firstTime", false);
        }
      }
    ]
  });
}

function scriptVersionUpdate(){
  $http.get({
    url: "https://raw.githubusercontent.com/ZacharyQin/oneClock-for-jsbox/master/updateInfo.js",
    handler: function(resp) {
      let newVersion = resp.data.version;
      let msg =resp.data.msg;
      if(newVersion>version){
        $ui.alert({
          title: "已有新版本发布!V${newVersion}",
          message: "是否更新？\n更新完成后请重新启动脚本。\n更新内容：${msg}",
          actions:[{
            title:"更新",
            handler:function(){
              let url="jsbox://install?url=https%3a%2f%2fraw.githubusercontent.com%2fZacharyQin%2foneClock-for-jsbox%2fmaster%2fOneClock.js&name=OneClock&icon=icon_040.png"
              $app.openURL(url);
              $app.close();
            }    
          },
          {
            title:"取消"
          }
        ]
        });
      }
    }
  });
}
