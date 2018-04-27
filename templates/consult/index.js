// 详情页定制弹层
import { phoneRegExpTest } from '../../utils/util';

const ConsultTempl = {
  showConsultTempl: function() {
    this.setData({ isShowConsult: true });
  },
  hideConsultTempl: function() {
    this.setData({ hideConsultClass: 'hideConsultClass' });
    setTimeout(()=>{
      this.setData({ isShowConsult: false, hideConsultClass: null });
    }, 300);
  },
  phoneTypeChange: function(e) {
    const { value } = e.detail;
    this.setData({ selectPhoneIndex: value });
  },
  formSubmit: function(e) {
    const _this = this;
    const { value } = e.detail;
    const { phone, check } = value;
    const checkReg = check.split(',');
    const checkMsg = phoneRegExpTest(checkReg[0], phone);
    const url = 'https://w.woqu.com/pack/customorder/create';
    if ( checkMsg.code ) {
      wx.showLoading({title: '提交中...', mask: true});
      wx.request({
        url: `${url}?wantGo=&ad=&travelDays=&countryCode=${checkReg[2]}&phone=${phone}&remark=`,
        success(res) {
          const { data = {} } = res;
          if( data.result ) {
            _this.showSuccessTempl();
            _this.setData({ isShowConsult: false });
          }else {
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
      _this.setData({ isShowError: true, errorMsg: checkMsg.msg });
    }
  }
};

export default ConsultTempl;