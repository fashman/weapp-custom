// 验证不通过提示
const errorTempl = {
  showErrorTempl: function() {
    this.setData({ isShowError: true });
  },
  closeErrorTempl: function() {
    this.setData({ isShowError: false });
  },
};

export default errorTempl;