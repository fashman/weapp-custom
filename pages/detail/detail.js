import fetchData, { phoneRange } from '../../utils/util';
import ConsultTemplFn from '../../templates/consult/index.js';
import telTemplFn from '../../templates/tel/index.js';
import alertTemplFn from '../../templates/alert/index.js';
import poiTemplFn from '../../templates/poi/index.js';
import successTemplFn from '../../templates/success/index.js';
import errorTemplFn from '../../templates/error/index.js';

//获取应用实例
const app = getApp()

Page({
  data: {
    arrHeight: [],
    curIndex: null,
    trvalTab: 1,
    highlightTab: 0,
    canIUse: wx.canIUse('createSelectorQuery'),
    isIos: wx.getSystemInfoSync().system.indexOf('iOS') > -1,
    refreshTimer: null,
    isloading: true,
    hasUserInfo: true,
  },
  onLoad: function (query) {
    
    const _this = this;
    const { openID } = app.globalData;
    const code = query.code || null;
    _this.setData({ code });
    wx.setNavigationBarTitle({title: '行程详情'});
    if ( !_this.data.canIUse ) {
      wx.showModal({content: '您的微信版本号较低，有些功能无法体验！'});
    }

    if ( !openID ) {
      app.getUserInfo(( id ) => {
        _this.getProductInfo(code);
        _this.addToHistory(id, code);
      }, () => {
        _this.setData({ hasUserInfo: false });
        wx.hideShareMenu();
      });
    } else {
      _this.getProductInfo(code);
      _this.addToHistory(openID, code);
    }
  },
  onPageScroll: function(e) {
    const scrollTop = e.scrollTop;
    const { arrHeight, canIUse } = this.data;
    if( !canIUse ) return;
    if(arrHeight.length){
      if( scrollTop >= arrHeight[0] - 60 && scrollTop < arrHeight[1] ) {
        this.setData({ curIndex: 0 });
      } else if ( scrollTop >= arrHeight[1] - 60 && scrollTop < arrHeight[2] ) {
        this.setData({ curIndex: 1 });
      } else if ( scrollTop >= arrHeight[2] - 60 && scrollTop < arrHeight[3] ) {
        this.setData({ curIndex: 2 });
      } else if ( scrollTop >= arrHeight[3] - 60 && scrollTop < arrHeight[4] ) {
        this.setData({ curIndex: 3 });
      } else if ( scrollTop >= arrHeight[4] - 60 ) {
        this.setData({ curIndex: 4 });
      } else if ( scrollTop < arrHeight[0] - 60 ) {
        this.setData({ curIndex: null });
      }
    }
  },
  toggleTap: function(e) {
    const _this = this;
    const key = e.currentTarget.dataset.key;
    const v = e.currentTarget.dataset.v;
    _this.setData({ [key]: !_this.data[key] }, () => {
      _this.setHeightList();
    });
  },
  handleTab: function(e) {
    const _this = this;
    const key = e.currentTarget.dataset.key;
    const value = e.currentTarget.dataset.value;
    const now = _this.data[key];
    if ( value == now ) return;
    _this.setData({ [key]: value }, () => {
      _this.setHeightList();
    });
  },
  handlClick: function(e) {
    const { canIUse, arrHeight, isIos } = this.data;
    const value = e.currentTarget.dataset.value;
    const key = e.currentTarget.dataset.key;
    const now = this.data[key];
    if ( value == now || !canIUse) return;
    this.setData({ [key]: value });
    wx.pageScrollTo({
      scrollTop: arrHeight[value] + ( isIos ? 50 : 0)
    });
  },
  setHeightList: function() {
    const _this = this;
    const Query = wx.createSelectorQuery();
    if( !_this.data.canIUse ) return;
    Query.select('.banner').boundingClientRect();
    Query.select('.highlight').boundingClientRect();
    Query.select('.map').boundingClientRect();
    Query.select('.trip').boundingClientRect();
    Query.select('.other').boundingClientRect();
    Query.exec(function(res) {
      let arr = [];
      res.forEach(val =>{ arr.push( val.height ); });
      _this.setData({
        arrHeight: [
          arr[0],
          arr[0] + arr[1],
          arr[0] + arr[1] + arr[2],
          arr[0] + arr[1] + arr[2] + arr[3],
          arr[0] + arr[1] + arr[2] + arr[3] + arr[4]
        ]
      });
    });
  },
  getProductInfo: function(code) {
    const _this = this;
    fetchData({
      url: `/xcx/detail/${code}`,
      method: 'get',
      success(res) {
        if ( res.rs === 1 ) {
          const lights = res.data.lights || [];
          res.data.lights = lights.map((val, ind)=>{
            const body = val.body || [];
            val.body = body.map((v, i)=>{
              const content = v.content;
              if( content.indexOf('|') > -1){
                v.content = content.split('|')[0];
                v.imgs = content.split('|')[1].split('&').map(val=>{
                  return val.replace(/([\s\S]*)\/\/([\s\S]*)/, 'http://$2');
                });
              }
              return v;
            });
            return val;
          });
          _this.setData({
            detail: res.data,
            hasUserInfo: true,
            isloading: false,
            // 小程序 数据统计 自定义字段
            title: res.data.title,
            price: res.data.price
          }, () => {
            _this.setHeightList();
          });
        } else {
          console.log('fetch detail error return');
        }
      },
      fail(res) {
        console.log('fetch detail fail');
      },
      complete: function(){
        clearTimeout(_this.data.refreshTimer);
      }
    });
    fetchData({
      url: `/xcx/detail/schedule/${code}`,
      method: 'get',
      success(res) {
        console.log('schedule');
        if ( res.rs === 1 ) {
          _this.setData({
            schedule: res.data,
            hasUserInfo: true,
            isloading: false
          }, () => {
            _this.setHeightList();
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: `网络异常，请稍后重试！`,
          });
        }
      },
      fail(res) {
        wx.showModal({
          title: '温馨提示',
          content: `网络异常，请稍后重试！`,
        });
        console.log('fetch schedule fail');
      },
      complete: function() {
        clearTimeout(_this.data.refreshTimer);
      }
    });
  },
  addToHistory: function(openID, code) {
    fetchData({
      url: `/xcx/visit/add-log?openID=${openID}&code=${code}`,
      method: 'get'
    });
  },
  authorSetting: function() {
    const _this = this;
    app.authorSetting((openID) => {
      const code = _this.data.code;
      _this.getProductInfo(code);
      _this.addToHistory(openID, code);
      wx.showShareMenu();
    });
  },
  onPullDownRefresh: function() {
    const { refreshTimer, hasUserInfo } = this.data;
    if ( !hasUserInfo ) {
      wx.stopPullDownRefresh();
      return;
    }
    if ( refreshTimer ) clearTimeout(refreshTimer);
    this.data.refreshTimer = setTimeout(() => {
      wx.stopPullDownRefresh();
      const code = this.data.code;
      code && this.getProductInfo( code );
    }, 300);
  },
  onShareAppMessage: function() {
    const { detail } = this.data;
    const { title, images } = detail;
    return {
      title: title || '我行定制游',
      path: `/pages/detail/detail?code=${this.data.code}`,
      imageUrl: images && images.length ? images[0] : '',
      success: function() {}
    }
  },
  ...ConsultTemplFn,
  ...telTemplFn,
  ...alertTemplFn,
  ...poiTemplFn,
  ...successTemplFn,
  ...errorTemplFn
})
