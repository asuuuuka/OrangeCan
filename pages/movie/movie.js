var util = require('../../util/util.js')
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {},
  },
  onLoad: function(event) {
    var inTheatersUrl =
      "http://tchu.brainex.cn/forwardreq/https/api.douban.com/v2/movie/in_theaters?start=0&count=3";
    var comingSoonUrl =
      "http://tchu.brainex.cn/forwardreq/https/api.douban.com/v2/movie/coming_soon?start=0&count=3";
    var top250Url =
      "http://tchu.brainex.cn/forwardreq/https/api.douban.com/v2/movie/top250?start=0&count=3";

    wx.showNavigationBarLoading();
    console.log('show');

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function(error) {
        // fail
        console.log(error)
      }
    })
  },
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
      wx.navigateTo({
        url: "more-movie/more-movie?title=" + category
      })
  

  },
  onMovieTap:function(event){
    var name = event.currentTarget.dataset.movieTitle;
    wx.navigateTo({
      url: "movie-movie/movie-movie?name=" + name
    })

  },

  processDoubanData: function(moviesDouban, settedKey,
    categoryTitle) {
    var movies = [];
    console.log(moviesDouban)
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
    console.log('hide');
    wx.hideNavigationBarLoading();
  },

  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ''
    })
  },

  onBindConfirm:function(event){
    var keyWord = event.detail.value;
    var searchUrl = "http://tchu.brainex.cn/forwardreq/https/api.douban.com/v2/movie/search?q=" + keyWord;
    this.getMovieListData(searchUrl,"searchResult",""); 
  },


})