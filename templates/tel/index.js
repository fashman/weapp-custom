// 详情页客服电话弹层
const telTempl = {
  showTelTempl: function() {
    this.setData({ isShowTel: true });
  },
  hideTelTempl: function() {
    this.setData({hideTelClass: 'hideTelClass'});
    setTimeout(()=>{
      this.setData({ isShowTel: false, hideTelClass: null });
    }, 300);
  },
  tapToCall: function(e) {
    const { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }
};

export default telTempl;