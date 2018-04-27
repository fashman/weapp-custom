// 二次确认弹层
const alertTempl = {
  showAlertTempl: function() {
    this.setData({ isShowAlert: true });
  },
  hideAlertTempl: function() {
    this.setData({ isShowAlert: false });
  }
};

export default alertTempl;