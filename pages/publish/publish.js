var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
import { supabase } from '../../lib/supabase'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    select_if: true,
    touxing_img: '',
    name: '',
    content_up_del_if: false,
    logData: [{ name: '生活',id:1 },{ name: '学习',id:2 },{ name: '问答',id:3 },{ name: '情感',id:4 }],
    tag_val: '',
    btnDisableed:false,
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tijiaook: '提交成功',
    })
    that.getStorage();
  },
  select_img: function () {
    var that = this;
    var imageList = that.data.imageList;
    wx.chooseMedia({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      async success(res) {
        const file = res.tempFiles[0]
        const fileExt = res.tempFiles[0].tempFilePath.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        let { error: uploadError } = await supabase.storage
          .from('avatar')
          .upload(filePath, file)
        if (uploadError) {
          throw uploadError
        }
        const { data } = await supabase.storage
          .from('avatar')
          .download(filePath)
        console.log(data)
        that.data.imageList.push(data)
        that.setData({ imageList: that.data.imageList })
      }
    })
  },

  remove_img: function (imageList, del_imgs) {
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i] == del_imgs) {
        imageList.splice(i, 1);
      }
    }
    return -1;
  },

  del_imgs: function (e) {
    var imageList = this.data.imageList;
    var del_imgs = e.target.id;
    this.remove_img(imageList, del_imgs);
    this.setData({
      content_up_del_if: false,
      imageList: this.data.imageList,
    })
    if (this.data.imageList.length < 6) {
      this.setData({
        select_if: true
      })
    }
  },

  yulian_select_img: function (e) {
    wx.previewImage({
      current: e.target.id,
      urls: [e.target.id]
    })
  },

  // dizhi: function () {
  //   var that = this;
  //   if (that.data.address == undefined) {
  //     wx: wx.showModal({
  //       title: '提示',
  //       content: that.data.qingkaiqisouquan,
  //     })
  //   }
  //   wx.chooseLocation({
  //     type: 'wgs84',
  //     success(res) {
  //       var name = res.name
  //       var address = res.address
  //       that.setData({
  //         address: address
  //       })
  //     },
  //     fail() {

  //     }
  //   })
  // },


  //选择文章类型
  radioChange(e) {
    this.setData({ tag_val: e.detail.value })
  },
  //提交发布内容
  formSubmit: async function (e) {
    var that = this;
    //console.log(e.detail.value)
    var imageList = that.data.imageList;
    wx.getStorage({
      key: 'user',
      success(res) {
        that.setData({
          touxing_img: res.data.touxing_img,
          name: res.data.name
        })
      }
    });
    if (that.data.touxing_img == '' || that.data.name == '') {
      wx.showToast({
        icon: 'none',
        title: '发布内容请先授权登录',
      })
      return
    }
    if (e.detail.value.textarea !== '') {
      if (!this.data.tag_val) {
        wx.showToast({
          icon: 'none',
          title: '请选择文章类型',
        })
        return
      }
      that.setData({btnDisableed:true})
      const {
        error
      } = await supabase.from("post_list").insert({
        userName: that.data.name,
        tag_val: that.data.tag_val,
        content: e.detail.value.textarea,
        content_imgs: imageList.length ? JSON.stringify(imageList) : '',
        avatar: that.data.touxing_img
      })
      if (error.statusCode != 200 && error.statusCode != 201) {
        wx.showToast({
          icon: 'none',
          title: '发布失败，请重新发布',
        })
        return
      } else {
        //首页用关系型sql通过浏览量查post,在这里顺便在每一条创建一条浏览数，要不然首页查不到新增的post
        await supabase.from("page_views").insert({
          views: 0, post_id: error.data[0].id
        })
      }
      that.setData({
        btnDisableed:false,
        textarea_val: '',
        dianhua_val: '',
        imageList: [],
      })
      wx.showToast({
        icon: 'success',
        title: that.data.tijiaook,
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index',
        })
      }, 2300)
    } else {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空',
      })
      return
    }


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
  //todo:定位
  // getLocation: function() {
  //   var that = this
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function(res) {
  //       var speed = res.speed
  //       var accuracy = res.accuracy
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       that.setData({
  //         latitude: res.latitude,
  //         longitude: res.longitude
  //       })

  //       var qqmapsdk = new QQMapWX({
  //         key: '' //key
  //       });

  //       qqmapsdk.reverseGeocoder({
  //         location: {
  //           latitude: res.latitude,
  //           longitude: res.longitude
  //         },
  //         success: function(res) {
  //           that.setData({
  //             address: res.result.address
  //           })
  //         }
  //       })
  //     },
  //     fail: function() {

  //     }
  //   })
  // },





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