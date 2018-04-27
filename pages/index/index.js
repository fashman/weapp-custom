import successTemplFn from '../../templates/success/index.js';
import errorTemplFn from '../../templates/error/index.js';
import { phoneRegExpTest } from '../../utils/util';

//获取应用实例
const app = getApp();

Page({
  data: {
    selectPhoneIndex: 0,
    destinations: '',
    duration: '',
    peopleNums: '',
    remark: '',
    mobile: ''
  },
  onLoad: function () {
    wx.setNavigationBarTitle({title: '我趣定制游'});
  },
  formSubmit: function(e) {
    const _this = this;
    const { value } = e.detail;
    const { destinations, peopleNums, duration, remark, mobile, check } = value;
    const checkReg = check.split(',');
    // 检测手机号和对应手机区号是否匹配
    const checkMsg = phoneRegExpTest(checkReg[0], mobile);
    const contactInfo = {};
    contactInfo.countryCode = checkReg[2];
    contactInfo.mobile = mobile;
    if ( checkMsg.code ) {
      wx.showLoading({title: '提交中...', mask: true});
      wx.request({
        url: 'https://m.woqu.com/custom/intent/create',
        method: 'post',
        data: {
          channel: 'WOQU',
          contactInfo,
          destinations,
          duration,
          peopleNums,
          source: 'SROUTINE'
        },
        success(res) {
          const { data = {} } = res;
          if( data.result ) {
            // 展示成功弹层
            _this.showSuccessTempl();
            // 选项置空
            _this.setData({
              selectPhoneIndex: 0, destinations: '', peopleNums: '',
              duration: '', remark: '', mobile: ''
            });
          }else {
            // 显示错误提示
            _this.setData({ isShowError: true, errorMsg: data.returnMessage });
          }
        },
        fail() {
          _this.setData({ isShowError: true, errorMsg: '网络异常，请稍后再试！' });
        },
        complete() {
          wx.hideLoading();
        }
      });
    } else {
      // 显示手机号码不匹配提示
      _this.setData({ isShowError: true, errorMsg: checkMsg.msg });
    }
  },
  // 手机区号更改
  phoneTypeChange: function(e) {
    const { value } = e.detail;
    this.setData({ selectPhoneIndex: value });
  },
  ...successTemplFn,
  ...errorTemplFn
})
