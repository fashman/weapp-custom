export default function fetchData(options) {
  // localStorage goes here

  //do some default setting here
  let method = options.method || 'POST', //default POST
      contentType = options.contentType || 'application/json', //default JSON
      loading = options.loading != undefined ? options.loading : true, //default show loading
      data = options.data,
      success = options.success,
      fail = options.fail,
      error = options.error,
      complete = options.complete;

  //showLoading before request
  if(loading) {
    wx.showLoading({
      title: 'Loading',
      mask: true
    });
  }
  //request here
  wx.request({
    url: `https://plan.woqu.com/${options.url}`,
    method: method,
    data: data,
    header: {
      'content-type': contentType
    },
    success: function(res) {
      let crs = res.data;
      success && (typeof success === 'function') && success(crs);
    },
    fail: function(e) {
      fail && (typeof fail === 'function') && fail(e);
    },
    complete: function() {
      complete && (typeof complete === 'function') && complete();
      if(loading) wx.hideLoading(); //alway hideLoading when request complete
    }
  });
}

// 电话号码格式检测
const phoneRegExpTest = function(type, content) {
  const regExpMap = {
    'mobileCN'			  : /^1[0-9]{10}$/,												  //中国1开头的10为数字
    'mobileUSA'			  : /^[0-9]{10,11}$/, 											//美国10位数字
    'mobileCAD'			  : /^[0-9]{10,11}$/, 											//加拿大10位数字
    'mobileAUD'			  : /^[0-9]{9,10}$/, 												//澳大利亚9位
    'mobileNZD'			  : /^[0-9]{9,10}$/, 												//新西兰9位数字
    'mobileHK'			  : /^[0-9]{8,9}$/, 												//香港
    'mobileMacau'		  : /(^0\d{8}$)|(^6\d{7}$)/, 								//澳门
    'mobileTW'			  : /^[0-9]{9,10}$/, 												//台湾
    'mobileUK'			  : /(^0\d{10}$)|(^7\d{9}$)/,								//英国手机号码位数：10位数字，7开头
    'mobileFrance'		: /^[0-9]{9,10}$/, 												//法国手机号码位数：9位数字
    'mobileGermany'	  : /^[0-9]{10,11}$/, 											//德国手机号码位数：11位数字
    'mobileBelgium'	  : /(^0\d{9}$)|(^4\d{8}$)/, 								//比利时手机号码位数：10位数字，4开头
    'mobileItaly'		  : /(^0\d{10}$)|(^3\d{9}$)/, 							//意大利手机号码位数：10位数字
    'mobileSpain'		  : /(^0\d{9}$)|(^7\d{8}$)|(^6\d{8}$)/, 		//西班牙手机号码位数：9位数字，以6开头
    'mobileSwiss'		  : /^[0-9]{9,10}$/, 												//瑞士手机号码位数：10位数字，07开头
    'mobileHolland'	  : /(^0\d{9}$)|(^6\d{8}$)/, 								//荷兰手机号码位数：10位数字，以06开头
    'mobileGreece'		: /(^0\d{10}$)|(6\d{9}$)/, 								//希腊手机号码位数：10位数字
    'mobileNorway'		: /(^0\d{8}$)|(^4\d{7}$)|(^9\d{7}$)/,
    'mobileMalaysia'	: /^\d+$/,
  },
  regExpErrMap = {
    'mobileCN'			  : '请输入正确的手机号(中国)',
    'mobileUSA'			  : '请输入正确的手机号(美国/加拿大)',
    'mobileCAD'			  : '请输入正确的手机号(美国/加拿大)',
    'mobileAUD'			  : '请输入正确的手机号(澳大利亚)',
    'mobileNZD'			  : '请输入正确的手机号(新西兰)',
    'mobileHK'			  : '请输入正确的手机号(香港)',
    'mobileMacau'		  : '请输入正确的手机号(澳门)',
    'mobileTW'			  : '请输入正确的手机号(台湾)',
    'mobileUK'			  : '请输入正确的手机号(英国)',
    'mobileFrance'		: '请输入正确的手机号(法国)',
    'mobileGermany'	  : '请输入正确的手机号(德国)',
    'mobileBelgium'	  : '请输入正确的手机号(比利时)',
    'mobileItaly'		  : '请输入正确的手机号(意大利)',
    'mobileSpain'		  : '请输入正确的手机号(西班牙)',
    'mobileSwiss'		  : '请输入正确的手机号(瑞士)',
    'mobileHolland'	  : '请输入正确的手机号(荷兰)',
    'mobileGreece'		: '请输入正确的手机号(希腊)',
    'mobileNorway'		: '请输入正确的手机号(挪威)',
    'mobileMalaysia'	: '请输入正确的手机号(马来西亚)',
   };
  return {code: regExpMap[type].test(content), msg: regExpErrMap[type]};
};

export { phoneRegExpTest };
