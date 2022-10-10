Page({

  /**
   * 页面的初始数据
   */
  data: {
    touxing_img: '',
    name: '',
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },


  getStorage: function () {
    var that = this;
    wx.getStorage({
      key: 'user',
      success(res) {
        that.setData({
          touxing_img: res.data.touxing_img,
          name: res.data.name
        })
      }
    });
  },

  shezhi: function () {
    wx.getSetting({
      success: function (res) {
        wx.openSetting({

        })
      }
    })
  },
  getUserProfile(e) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        var that = this;
        wx.setStorage({
          key: 'user',
          data: {
            touxing_img: res.userInfo.avatarUrl,
            name: res.userInfo.nickName
          },
        });
        
        that.setData({
          touxing_img: res.userInfo.avatarUrl,
          name: res.userInfo.nickName,
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用 getUserInfo 获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    var that = this;
    wx.setStorage({
      key: 'user',
      data: {
        touxing_img: res.userInfo.avatarUrl,
        name: res.userInfo.nickName
      },
    });
    that.setData({
      touxing_img: res.userInfo.avatarUrl,
      name: res.userInfo.nickName,
      userInfo: res.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    var that = this;
    that.setData({
      guanyupt: '关于论坛',
      shezhizhongxin: '设置中心',
      tishishouq: '提示授权',
      quedingshouq: '确定授权',
    })
    that.getStorage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStorage();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})