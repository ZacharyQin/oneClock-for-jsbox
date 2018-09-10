/**
 * @Version 1.0
 * @author Zachary_M
 * @date 2018.9.10
 * @brief
 *   本人写的第一个脚本，真"从0开始写js",写的稀烂,望多多体谅。
 *   该脚本是对app"oneClock"其中一个界面的实现,原app的翻页效果比较有趣，个人能力有限无法实现
 * 因为条件原因，未对分辨率1334x750以外的设备做测试，如出现布局错位的情况可修改下面参数(主要是)
 * 双击更换主题
 * @/brief
 */
let screenWidth=$device.info["screen"]["width"]
let screenHeight=$device.info["screen"]["height"]
if (screenHeight<screenWidth){
  let tmp= screenWidth
  screenWidth=screenHeight
  screenHeight=tmp
}
let timeFontSize = 180; //时钟的字体大小

let cardsDistance=40//卡片之间的距离
let cardLength=screenHeight-screenWidth-cardsDistance//卡片边长，暂时处理成正方形
let cardSize = $size(cardLength, cardLength); //卡片大小
let edgeSize = (screenWidth-cardSize.width)/2; //卡片边距

let blankBarPos = edgeSize + cardSize.height/2-3; //竖屏时上下卡片遮挡条的prototype

let blankBarHeight = 5; //黑边遮挡条的宽度

$app.idleTimerDisabled = true//设置成不熄屏

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
};
//主题配色
var theme = "black";
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
  if (hour > 12) {
    return "PM";
  } else {
    return "AM";
  }
}; //am,pm判断

main();
var timer = $timer.schedule({
  interval: 1,
  handler: function() {
    let date = new Date();
    let chour = timeFormate(date.getHours());
    let cminute = timeFormate(date.getMinutes());
    if ($("minutes").text != cminute || $("hours").text != chour) {
      $ui.animate({
        duration: 0.4,
        animation: function() {
          $("hours").text = chour;
          $("minutes").text = cminute;
          let capm=apm($("hours").text)
          $console.log(capm)
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
          make.top.left.inset(edgeSize);
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
          make.bottom.right.inset(edgeSize);
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
          make.centerX.equalTo(view.super), make.top.inset(blankBarPos);
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
};

var isIphoneX = $device.isIphoneX;
var isIphonePlus = $device.isIphonePlus;
var isIpad = $device.isIpad;
var isIpadPro = $device.isIpadPro;
if (
  (isIphoneX || isIphonePlus || isIpad || isIpadPro) &&
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
