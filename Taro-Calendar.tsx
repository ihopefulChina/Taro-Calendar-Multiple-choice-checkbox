/* url - 多选日期 日历页面 - */
import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import styles from "./index.modules.less";
import classNames from "classnames";

export default class Index extends Component {
  state = {
    //月份
    nowMonDate: {} as { year; month },
    //星期
    weekStr: ["日", "一", "二", "三", "四", "五", "六"],
    //当前视图日历
    calendarDays: [] as { title; active; isNowMonth; year; month }[],
    //选中的日期数据
    selectDays: [] as { year; month; day }[]
  };

  //组件第一次渲染前
  componentWillMount() {
    //初始化，默认显示当前月份
    const date = new Date();
    let nowMonDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1
    };
    this.setState({
      nowMonDate
    });
    //计算当前视图日历
    this.handleCalendar(nowMonDate);
  }

  //组件第一次渲染完成
  componentDidMount() {}

  //组件即将销毁
  componentWillUnmount() {}

  //跳转别的页面时生命周期  相对于微信小程序生命周期onHide
  componentDidShow() {}

  //跳转别的页面再回来时的生命周期  相对于微信小程序生命周期onShow
  componentDidHide() {}

  render() {
    const { nowMonDate, weekStr, calendarDays } = this.state;
    return (
      <View className={styles.selectDate}>
        <View className={styles.content}>
          <View className={styles.nextPreDate}>
            <View
              className={styles.iconPre}
              onClick={() => {
                this.onNextPreDate(1);
              }}
            ></View>
            <View className={styles.nowMonDate}>
              {nowMonDate.year + "-" + nowMonDate.month}
            </View>
            <View
              className={styles.iconNext}
              onClick={() => {
                this.onNextPreDate(2);
              }}
            ></View>
          </View>
          <View className={styles.calendarContent}>
            <View className={styles.weekContent}>
              {weekStr.map((item, index) => (
                <Text key={index}>{item}</Text>
              ))}
            </View>
            <View className={styles.daysContent}>
              {calendarDays.map((item, index) => (
                <View
                  key={index}
                  className={classNames(
                    styles.days,
                    item.active ? styles.activeDays : null
                  )}
                >
                  {item.isNowMonth ? (
                    <Text
                      onClick={() => {
                        this.selectDay(item, index);
                      }}
                    >
                      {item.title}
                    </Text>
                  ) : (
                    <Text className={styles.noNowDays}>{item.title}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className={styles.bottomButton}>
          <View onClick={this.onGetDate} className={styles.buttonContent}>
            确认
          </View>
        </View>
      </View>
    );
  }

  //切换月份
  onNextPreDate(num) {
    let nowMonDate = this.state.nowMonDate;
    if (num == 1) {
      //减月份
      if (nowMonDate.month == 1) {
        nowMonDate.month = 12;
        nowMonDate.year--;
      } else {
        nowMonDate.month--;
      }
    } else if (num == 2) {
      //加月份
      if (nowMonDate.month < 12) {
        nowMonDate.month++;
      } else {
        nowMonDate.month = 1;
        nowMonDate.year++;
      }
    }
    this.setState({
      nowMonDate
    });
    //计算当前视图日历
    this.handleCalendar(nowMonDate);
  }

  //获取月份天数
  getMonthDays(date) {
    let stratDate;
    let endData;
    if (date) {
      stratDate = new Date(date.year, date.month - 1, 1);
      endData = new Date(date.year, date.month, 1);
    }
    return (Number(endData) - Number(stratDate)) / (1000 * 60 * 60 * 24);
  }

  //获取月首日和最后一日
  getDays(date, num) {
    let days = {} as { year; month };
    if (num == 1) {
      if (date.month == 1) {
        days.month = 12;
        days.year = date.year - 1;
      } else {
        days.month = date.month - 1;
        days.year = date.year;
      }
    } else {
      if (date.month < 12) {
        days.month = date.month + 1;
        days.year = date.year;
      } else {
        days.month = 1;
        days.year = date.year + 1;
      }
    }
    return days;
  }

  //给定数值（月天数），每日循环赋值
  pushArray(days, blo, year, month) {
    let nowMonDays = new Array();
    var i = 1;
    while (i <= days) {
      let day = {
        title: i,
        active: false,
        isNowMonth: blo,
        year,
        month
      };
      nowMonDays.push(day);
      i++;
    }
    return nowMonDays;
  }

  //当前日历
  handleCalendar(nowMonDate) {
    //获取当前月份天数
    const days = this.getMonthDays(nowMonDate);
    //获取上个月天数
    let preDate = this.getDays(nowMonDate, 1);
    const preDays = this.getMonthDays(preDate);
    //获取下个月天数
    let nextDate = this.getDays(nowMonDate, 2);
    const nextDays = this.getMonthDays(nextDate);

    //当前月份和年
    let nowYear = nowMonDate.year;
    let nowMonth = nowMonDate.month;

    //判断上个月的月份和年
    let preYear = nowMonDate.year;
    let preMonth = nowMonDate.month - 1;
    if (nowMonth == 1) {
      preYear = nowMonDate.year - 1;
      preMonth = 12;
    }

    //判断下个月的月份和年
    let nextYear = nowMonDate.year;
    let nextMonth = nowMonDate.month - 1;
    if (nowMonth == 12) {
      preYear = nowMonDate.year + 1;
      preMonth = 1;
    }

    //循环当月
    let daysArray = this.pushArray(days, true, nowYear, nowMonth);

    //上次点击选中的保留下来
    const selectDays = this.state.selectDays;
    for (let index = 0; index < selectDays.length; index++) {
      //是否进入当前月份
      if (selectDays[index].month == nowMonth) {
        daysArray[selectDays[index].day - 1].active = true;
      }
    }

    //循环上个月
    let preDaysArray = this.pushArray(preDays, false, preYear, preMonth);
    //循环下个月
    let nextDaysArray = this.pushArray(nextDays, false, nextYear, nextMonth);

    //当前首日周几
    let stratWeek = new Date(nowMonDate.year, nowMonDate.month - 1, 1).getDay();

    //当前月份日历从上个月补充日期
    let supplementaryPreDate = preDaysArray.slice(
      preDaysArray.length - stratWeek,
      preDaysArray.length
    );

    //当前月份日历从下个月补充日期
    let supplementaryLastDate = [] as any;
    if (supplementaryPreDate.length + daysArray.length <= 35) {
      supplementaryLastDate = nextDaysArray.slice(
        0,
        35 - (supplementaryPreDate.length + daysArray.length)
      );
    } else {
      supplementaryLastDate = nextDaysArray.slice(
        0,
        42 - (supplementaryPreDate.length + daysArray.length)
      );
    }

    //拼接当前日历视图
    let calendarDays = [
      ...supplementaryPreDate,
      ...daysArray,
      ...supplementaryLastDate
    ];
    this.setState({ calendarDays });
  }

  //多选日期
  selectDay(item, index) {
    let calendarDays = this.state.calendarDays;
    //取反
    calendarDays[index].active = !calendarDays[index].active;

    //这里直接push给selectDays
    let selectDays = this.state.selectDays;
    if (calendarDays[index].active) {
      let day = {
        year: calendarDays[index].year,
        month: calendarDays[index].month,
        day: calendarDays[index].title
      };
      selectDays.push(day);
    } else {
      //这里写的不好，但是只能这么写了╮(╯﹏╰）╭
      for (let i = 0; i < selectDays.length; i++) {
        if (
          item.year == selectDays[i].year &&
          item.month == selectDays[i].month &&
          item.title == selectDays[i].day
        ) {
          selectDays.splice(i, 1);
        }
      }
    }
    this.setState({ calendarDays, selectDays });
  }

  //确认
  onGetDate() {
    let selectDays = this.state.selectDays;
    if (selectDays.length == 0) {
      Taro.showToast({
        title: "请选择日期",
        icon: "none"
      });
    } else {
      //这里点击确认后值
      console.log(selectDays);
      //格式为Arry{day;month;year}
    }
  }
}
