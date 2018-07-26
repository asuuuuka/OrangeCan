const app = getApp()

Page({
  data: {
    cityUrl: null,
    city: null,
    quality: null,
    pm2_5_1: null,
    aqi: null,
    pm2_5_24: null
  },
  onLoad: function(event) {
    var city = app.globalData.settingcity;
    this.setCityUrl(city);
    this.getAqiData();
  },

  setCityUrl: function(city) {
    this.setData({
      cityUrl: "http://tchu.brainex.cn/aqi/?city=" + city
    });
  },

  getAqiData: function () {
    var that = this;
    wx.request({
      url: this.data.cityUrl,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function(res) {
        console.log(res.data);
        that.processAqiData(res.data);
      },
      fail: function(error) {
        // fail
        console.log(error)
      }
    })
  },

  processAqiData: function (aqiData) {
    var data_0 = aqiData[0];
    var data = {
      city: data_0.area,
      quality: data_0.quality,
      pm2_5_1: data_0.pm2_5,
      aqi: data_0.aqi,
      pm2_5_24: data_0.pm2_5_24h
    }
    this.setData(data);
  },


})