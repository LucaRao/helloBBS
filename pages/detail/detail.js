import { supabase } from '../../lib/supabase'
import { formatTime } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    if_del_val: false,
    if_guanbi: false,
    hui_guan: false,
    liked: false,
    comment_content: [],
    btnDisableed:false
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    //页面文案
    that.setData({
      liulanliangs: '浏览量',
      dels: '删除',
      jubao: '举报',
      quanbupingls: '全部评论',
      pingls: '评论',
      guanbis: '关闭',
      fasongs: '发送',
      shouyes: '首页',
      dianzans: '点赞',
      lianxita: '联系他',
      fenxiang: '分享',
      huifus: '回复',
      quedingdels: '确定',
      delcg: '删除成功',
      quedingjubao: '确定举报',
      jubaook: '举报成功',
      qingshouqdengl: '分享',
    })
    that.getStorage();
    that.setData({
      id: options.id
    })
    this.getPostDetail(options.id);
    this.getCommentList(options.id);
    this.getDianzan(options.id)

  },

  //获取post详情
  async getPostDetail(post_id) {
    //文章
    const { data, error } = await supabase
      .from('post_list')
      .select('*').eq("id", post_id);
    if (data) {
      data.forEach(i => {
        i.content_imgs = i.content_imgs ? JSON.parse(i.content_imgs) : '';
        i.times = formatTime(i.times)
      })
      this.setData({ datas: data })
    }
  },
  //获取评论数量
  async getCommentList(post_id) {
    const { data, error } = await supabase
      .from('comment')
      .select('*').eq("post_id", post_id).order('created_at');
    if (data && data) {
      const replyData = await supabase
      .from('reply')
      .select('*');
      data.forEach(i => {
        i.created_at = formatTime(i.created_at)
      })
      if(replyData && replydata){
        this.setData({ comment_content: data, ly_size: data.length,replyData:replydata.data})
      }else{
        this.setData({ comment_content: data, ly_size: data.length,replyData:[] })
      }
      
      
    }
  },
  //获取当前用户是否点过赞
  async getDianzan(post_id) {
    const getLikes = await supabase
      .from('like').select('like_val,likers').eq("post_id", post_id);
    if (getLikes && getLikes.data) {
      if (getLikes.data[0] && getLikes.data[0].likers) {
        if (getLikes.data[0].likers.indexOf(this.data.name) != -1) {
          this.setData({ liked: true });
        }
      }
    }
  },
  //点赞动作
  async dianzan() {
    // debugger
    //没登录用户不能点赞
    if (!this.data.name) {
      wx.showToast({
        title: '授权后才能点赞',
        icon: 'none',
        duration: 3000
      });
      return
    }
    //已点赞不能再次点赞
    if (this.data.liked) {
      return;
    }
    const getLikes = await supabase
      .from('like').select('like_val,likers').eq("post_id", this.data.id);
    if (getLikes && getLikes.data.length > 0) {
      if (getLikes.data[0] && getLikes.data[0].likers) {
        if (getLikes.data[0].likers.indexOf(this.data.name) != -1) {
          this.setData({ liked: true });
          return
        }
      }

      const updateLikes = await supabase
        .from('like').update({
          like_val: getLikes.data[0].like_val + 1,
          likers: getLikes.data[0].likers + this.data.name
        }).eq("post_id", this.data.id);

    } else {
      let {
        error
      } = await supabase.from("like").insert({
        like_val: 1,
        post_id: this.data.id,
        likers: this.data.name
      }, {
        returning: "minimal", // Don't return the value after inserting
      })
      this.setData({ liked: true });
    }


  },
  //一进来请求一次浏览量再获取浏览量
  async getPageViews() {
    //没有这个文章就增加一条关于这条文章的浏览数据
    let views = 0;
    const getViews = await supabase
      .from('page_views').select('views').eq("post_id", this.data.id);
    if (getViews && getViews.data) {
      views = getViews.data[0].views
    }

    const updateViews = await supabase
      .from('page_views').update({
        views: views + 1
      }).eq("post_id", this.data.id);
    if (updateViews && updateViews.data) {
      this.setData({
        views: views + 1
      })
    }
  },
  select_del: function () {
    this.setData({
      if_del_val: !this.data.if_del_val
    })
  },
  //作者删除post，同时删除该post的评论点赞浏览量
   del_ (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: that.data.quedingdels,
      async success(res)  {
        if (res.confirm) {
        
          const del2 = await supabase
            .from('comment')
            .delete()
            .match({ post_id: that.data.id })
          const del3 = await supabase
            .from('like')
            .delete()
            .match({ post_id: that.data.id })
          const del4 = await supabase
            .from('page_views')
            .delete()
            .match({ post_id: that.data.id })
            //最后删除post 因为有外键关联
            const del1 = await supabase
            .from('post_list')
            .delete()
            .match({ id: that.data.id })
          wx.showToast({
            icon: 'success',
            title: that.data.delcg,
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index',
            })
          }, 2200)
        }
      }
    })
  },

  jbao: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: that.data.quedingjubao,
      success(res) {
        if (res.confirm) {
          wx.showToast({
            icon: 'success',
            title: that.data.jubaook,
          })
        }
      }
    })
  },
  shouye: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  bindtap_img: function (e) {
    wx.previewImage({
      current: e.target.dataset.id,
      urls: [e.target.dataset.id]
    })
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

  ping_guan: function (options) {
    this.setData({
      ping_placeholder: this.data.pingls + options.currentTarget.dataset.ping,
      if_guanbi: !this.data.if_guanbi
    })
  },
//发布评论
  async ping_form(e) {
    var that = this;
    that.setData({btnDisableed:true})
      //没登录用户不能点赞
      if (!that.data.name) {
        wx.showToast({
          title: '授权后才能点赞',
          icon: 'none',
          duration: 3000
        });
        return
      }
    if (that.data.name == undefined) {
      wx.showToast({
        icon: 'none',
        title: that.data.qingshouqdengl,
      })
    } else {
      let params = {
        post_id: that.data.id,
        commentator: that.data.name,
        responder: '',
        comment_content: e.detail.value.ping_txt,
        reply_content: '',
      }
      let {
        error
      } = await supabase.from("comment").insert(params, {
        returning: "minimal", // Don't return the value after inserting
      })
      if (error) {
        wx.showToast({
          title: error.message || '',
          icon: 'none',
          duration: 3000
        });
        return;
      }
        this.getCommentList(that.data.id)
        that.setData({
          if_guanbi: false,
          btnDisableed:false,
        })
    }
  },

  useame: function (options) {
    var that = this;
    that.setData({
      ping_placeholders: options.currentTarget.dataset.hui_useame,
      hui_name: options.currentTarget.dataset.hui,
      ping_placeholder: that.data.huifus + options.currentTarget.dataset.hui_useame,
      hui_guan: !that.data.hui_guan,
      ping_id:options.currentTarget.dataset.id,
    })
  },
  hui_guan: function () {
    this.setData({
      hui_guan: !this.data.hui_guan,
    })
  },
//发布回复
 async hui_form  (e) {
    var that = this;
    that.setData({btnDisableed:true})
      //没登录用户不能点赞
      if (!that.data.name) {
        wx.showToast({
          title: '授权后才能点赞',
          icon: 'none',
          duration: 3000
        });
        return
      }
    if (that.data.name == undefined) {
      wx.showToast({
        icon: 'none',
        title: that.data.qingshouqdengl,
      })
    } else {
      let params = {
        post_id: that.data.id,
        commentator: that.data.hui_name,
        responder: that.data.name,
        reply_content: e.detail.value.hui_txt,
        comment_id:that.data.ping_id
      }
      let {
        error
      } = await supabase.from("reply").insert(params, {
        returning: "minimal", // Don't return the value after inserting
      })
      if (error) {
        wx.showToast({
          title: error.message || '',
          icon: 'none',
          duration: 3000
        });
        return;
      }
        this.getCommentList(that.data.id)
        that.setData({
          hui_guan: !that.data.hui_guan,
          btnDisableed:false,
        })
    }
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
    this.getPageViews(this.data.id)
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: res.target.dataset.title,
        path: 'pages/index4/index4?id=' + JSON.stringify(res.target.id),
      }
    }
    return {
      path: 'pages/index/index',
    }

  }
})