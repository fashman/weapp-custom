// 提交信息成功提示
const successTempl = {
  showSuccessTempl: function() {
    this.setData({ isShowSuccess: true });
    setTimeout(()=> {
      this.setData({ isShowSuccess: false });
    }, 3000);
  }
};

export default successTempl;