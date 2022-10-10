// index.js
import { supabase } from '../../lib/supabase'
import { formatTime } from '../../utils/util'
// 获取应用实例
const app = getApp()

Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: '全部',
    currentTab2: '默认',
    content_tabList: [{ name: '默认' }, { name: '最新' }, { name: '热门' },{ name: '我的' }],
    // 居中显示项的位置
    centerItem: 0,
    // 首页轮播图数据
    coverList: [
      {
        id: 0,
        url: "../../images/swiper1.jpg"
      },
      {
        id: 1,
        url: "../../images/swiper2.jpg"
      },
      {
        id: 2,
        url: "../../images/swiper3.jpg"
      }
    ],
    //内容
    datas: [],
    page_views: [
      { id: '1', views: 123 }
    ],
    like_val: [{ id: '1', like_val: 21 }],
    commit_val: [{ id: '1', like_val: 21 }],
    tabList:[{ name: '全部' },{ name: '生活' },{ name: '学习' },{ name: '问答' },{ name: '情感' }]
  },

  onLoad() {
    this.getStorage()
    // this.get_tags();
    this.getPostList('全部', '默认','我的')
    // if (wx.getUserProfile) {
    //   this.setData({
    //     canIUseGetUserProfile: true
    //   })
    // }
    var that = this;

    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  //获取名称头像
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
  onShow(){
    this.getPostList('全部', '默认')
  },
  //获取post列表
  async getPostList(tagType, postType) {
    if (tagType == '全部') {
      let viewsList = [];
      this.setData({
        datas: viewsList
      })
      //默认
      if (postType == '默认' || postType == '最新') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
        views,
        post_list (id,times,userName,tag_val,content,avatar,content_imgs).order('times')
      `);
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            i.post_list.views = i.views ? i.views : 0;
            i.post_list.times = formatTime(i.post_list.times)
            i.post_list.commit_val = await this.getCommentList(i.post_list.id);
            i.post_list.like_val = await this.getLikeList(i.post_list.id)
            i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
            viewsList.push(i.post_list);
            this.setData({
              datas: viewsList
            })
          })

          console.log(this.data.datas)
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
        //最新
      } else if (postType == '热门') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            i.post_list.views = i.views ? i.views : 0;
            i.post_list.times = formatTime(i.post_list.times)
            i.post_list.commit_val = await this.getCommentList(i.post_list.id);
            i.post_list.like_val = await this.getLikeList(i.post_list.id)
            i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
            viewsList.push(i.post_list);
            this.setData({
              datas: viewsList
            })
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }else if (postType == '我的') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.userName == this.data.name) {
            i.post_list.views = i.views ? i.views : 0;
            i.post_list.times = formatTime(i.post_list.times)
            i.post_list.commit_val = await this.getCommentList(i.post_list.id);
            i.post_list.like_val = await this.getLikeList(i.post_list.id)
            i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
            viewsList.push(i.post_list);
            this.setData({
              datas: viewsList
            })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }

    } else if (tagType == '生活') {
      let viewsList = [];
      this.setData({
        datas: viewsList
      })
      if (postType == '默认' || postType == '最新') {
        //默认
        const viewsdata = await supabase
          .from('page_views')
          .select(`
      views,
      post_list (id,times,userName,tag_val,content,avatar,content_imgs)
    `);
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '生活') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id);
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
        //最新
      } else if (postType == '热门') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '生活') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id)
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }else if (postType == '我的') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.userName == this.data.name && i.post_list.tag_val == '生活') {
            i.post_list.views = i.views ? i.views : 0;
            i.post_list.times = formatTime(i.post_list.times)
            i.post_list.commit_val = await this.getCommentList(i.post_list.id);
            i.post_list.like_val = await this.getLikeList(i.post_list.id)
            i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
            viewsList.push(i.post_list);
            this.setData({
              datas: viewsList
            })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }
    } else if (tagType == '学习') {
      let viewsList = [];
      this.setData({
        datas: viewsList
      })
      //默认
      if (postType == '默认' || postType == '最新') {
        //默认
        const viewsdata = await supabase
          .from('page_views')
          .select(`
      views,
      post_list (id,times,userName,tag_val,content,avatar,content_imgs).eq('tag_val', '学习').order('times')
    `);
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '学习') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id)
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
        //最新
      } else if (postType == '热门') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '学习') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id)
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }else if (postType == '我的') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.userName == this.data.name && i.post_list.tag_val == '学习') {
            i.post_list.views = i.views ? i.views : 0;
            i.post_list.times = formatTime(i.post_list.times)
            i.post_list.commit_val = await this.getCommentList(i.post_list.id);
            i.post_list.like_val = await this.getLikeList(i.post_list.id)
            i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
            viewsList.push(i.post_list);
            this.setData({
              datas: viewsList
            })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }
    } else if (tagType == '问答') {
      let viewsList = [];
      this.setData({
        datas: viewsList
      })
      //默认
      if (postType == '默认' || postType == '最新') {
        //默认
        const viewsdata = await supabase
          .from('page_views')
          .select(`
      views,
      post_list (id,times,userName,tag_val,content,avatar,content_imgs)
    `);
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '问答') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id)
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
        //最新
      } else if (postType == '热门') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '问答') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id)
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }else if (postType == '我的') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.userName == this.data.name && i.post_list.tag_val == '问答') {
            i.post_list.views = i.views ? i.views : 0;
            i.post_list.times = formatTime(i.post_list.times)
            i.post_list.commit_val = await this.getCommentList(i.post_list.id);
            i.post_list.like_val = await this.getLikeList(i.post_list.id)
            i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
            viewsList.push(i.post_list);
            this.setData({
              datas: viewsList
            })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }
    } else if (tagType == '情感') {
      let viewsList = [];
      this.setData({
        datas: viewsList
      })
      //默认
      if (postType == '默认' || postType == '最新') {
        //默认
        const viewsdata = await supabase
          .from('page_views')
          .select(`
      views,
      post_list (id,times,userName,tag_val,content,avatar,content_imgs)
    `);
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '情感') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id)
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
        //最新
      } else if (postType == '热门') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.tag_val == '情感') {
              i.post_list.views = i.views ? i.views : 0;
              i.post_list.times = formatTime(i.post_list.times)
              i.post_list.commit_val = await this.getCommentList(i.post_list.id);
              i.post_list.like_val = await this.getLikeList(i.post_list.id)
              i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
              viewsList.push(i.post_list);
              this.setData({
                datas: viewsList
              })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }else if (postType == '我的') {
        const viewsdata = await supabase
          .from('page_views')
          .select(`
          views,
          post_list (id,times,userName,tag_val,content,avatar,content_imgs)
        `).order('views', { ascending: false });
        if (viewsdata.data) {
          viewsdata.data.data.forEach(async (i) => {
            if (i.post_list.userName == this.data.name && i.post_list.tag_val == '情感') {
            i.post_list.views = i.views ? i.views : 0;
            i.post_list.times = formatTime(i.post_list.times)
            i.post_list.commit_val = await this.getCommentList(i.post_list.id);
            i.post_list.like_val = await this.getLikeList(i.post_list.id)
            i.post_list.content_imgs = i.post_list.content_imgs ? JSON.parse(i.post_list.content_imgs):''
            viewsList.push(i.post_list);
            this.setData({
              datas: viewsList
            })
            }
          })
        } else {
          wx.showToast({
            title: error.data.msg || '',
            icon: 'none',
            duration: 3000
          });
        }
      }
    }
  },
  //获取评论数量
  async getCommentList(post_id) {
    const { data, error } = await supabase
      .from('comment')
      .select('*').eq("post_id", post_id);
    if (data && data.data) {
      return data.data.length ? data.data.length : 0
    }
  },
  //获取点赞数量
  async getLikeList(post_id) {
    const { data, error } = await supabase
      .from('like')
      .select('like_val').eq("post_id", post_id);
    if (data && data.data) {
      return data.data[0] ? data.data[0].like_val : 0
    }
  },
  //获取文章类型选项
  // async get_tags() {
  //   const logData = await supabase.from('label_tag').select('name').order('created_at');
  //   if (logData && logData.data) {
  //     logData.data.data.unshift({ name: '全部' })
  //     this.setData({
  //       tabList: logData.data.data
  //     })
  //   }
  // },
  //  tab切换逻辑
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      this.getPostList(this.data.currentTab, this.data.currentTab2)
    }
  },
  //  中间tab内容切换
  clickTab2: function (e) {
    var that = this;

    if (this.data.currentTab2 === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab2: e.target.dataset.current
      })
      this.getPostList(this.data.currentTab, this.data.currentTab2)
    }
  },

  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  //轮播图滑动时改变居中项
  handleSwiperChange(e) {
    this.setData({
      centerItem: e.detail.current,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
