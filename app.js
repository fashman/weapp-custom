//app.js
import fetchData from './utils/util';

App({
  globalData: {
    openID: null,
    iv: null,
    encryptedData: null
  },
  authorSetting: function(success, fail) {
    const _this = this;
    wx.openSetting({
      success:(res) => {
        if(res.authSetting['scope.userInfo']) {
          _this.getUserInfo( success, fail );
        }
      }
    })
  },
  getUserInfo: function(success, fail) {
    const _this = this;
    wx.login({
      success(loginRes) {
        wx.getUserInfo({
          withCredentials: true,
          success: userRes => {
            const { iv, encryptedData } = userRes;
            _this.globalData.iv = iv;
            _this.globalData.encryptedData = encryptedData;
            fetchData({
              url: 'xcx/userinfo',
              data: { code: loginRes.code, iv, encryptedData },
              success(openRes) {
                if ( openRes.rs === 1 ) {
                  const { openID } = openRes.data;
                  _this.globalData.openID = openID;
                  _this.globalData.hasUserInfo = true;
                  success && (typeof success == 'function') && success(openID);
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: '获取用户ID失败！',
                  });
                }
              },
              fail() {
                wx.showModal({
                  title: '温馨提示',
                  content: '获取 fetch userinfo 失败！',
                });
              }
            });
          },
          fail(err) {
            fail && (typeof fail == 'function') && fail();
          }
        });
      },
      fail(err) {
        console.log('login fail');
      }
    });
  }
})