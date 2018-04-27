//index.js
import fetchData from '../../utils/util';

//获取应用实例
const app = getApp()

Page({
  data: {
    list: [],
    isBottom: false,
    refreshTimer: false,
    isloading: true,
    hasUserInfo: true
  },
  onLoad: function () {
    wx.setNavigationBarTitle({title: '我看过的'});
    const _this = this;
    const { openID } = app.globalData;
    
    if ( !openID ) {
      app.getUserInfo(( id ) => {
        _this.getList(id);
      }, () => {
        _this.setData({ hasUserInfo: false });
      });
    } else {
      _this.getList(openID);
    }
  },
  getList: function(openID) {
    const _this = this;
    fetchData({
      url: `/xcx//visit/list?openID=${openID}`,
      method: 'get',
      success(res) {
        if ( res.rs === 1 ) {
          _this.setData({ 
            list: res.data,
            hasUserInfo: true 
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: `获取浏览历史记录失败，${res.msg}`,
          });
        }
      },
      complete: function() {
        clearTimeout(_this.data.refreshTimer);
        _this.setData({ isloading: false });
      }
    });
  },
  onPullDownRefresh: function() {
    const _this = this;
    const refreshTimer = this.data.refreshTimer;
    if ( refreshTimer ) clearTimeout(refreshTimer);
    this.data.refreshTimer = setTimeout(() => {
      wx.stopPullDownRefresh();
      const openID = app.globalData.openID;
      openID && this.getList( openID );
    }, 300);
  },
  authorSetting: function() {
    const _this = this;
    app.authorSetting((openID) => {
      _this.getList(openID);
    });
  }
})
