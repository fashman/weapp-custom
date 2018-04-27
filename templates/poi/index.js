// 详情页POI景点介绍弹层
const poiTemplFn = {
  showPoiTempl: function(e) {
    const { type, data } = e.currentTarget.dataset;
    this.setData({ poiData: data, isShowPoi: true });
  },
  hidePoiTempl: function() {
    this.setData({ poiData: null, isShowPoi: false });
  }
};

export default poiTemplFn;