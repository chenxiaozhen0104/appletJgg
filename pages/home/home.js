// pages/home/home.js
var network = require("../../utils/net.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtn: true,
    isAccept: false,
    animationData: {},
    state: '',
    url: 'http://img.zmnbx.com//dist/Images/true.png',
    repairArea: [],
    repairSkill: []
  },
  // 接单或取消接单
  changeState: function (e) {
    var that = this
    network.GET({
      params: {},
      API_URL: "/api/user/UserInfo",
      success: (res) => {
        if (res.data.repairArea && res.data.skill) {
          let num = e.currentTarget.dataset.num
          var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
          })

          that.animation = animation

          animation.rotateY(num).step()

          that.setData({
            animationData: animation.export()
          })
          setTimeout(function () {
            that.setData({
              state: !that.data.state,
              url: 'http://img.zmnbx.com//dist/Images/ture1.png'
            })
          }.bind(that), 400)
          // 请求接单或取消接单
          let params = {}
          network.POST({
            params: params,
            API_URL: "/api/user/UpdateWorkState",
            success: (res) => {
              console.log(res)
              if (res.data.success) {
                wx.showToast({
                  title: num == 180 ? "开始接单啦" : "停止接单",
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
              } else {
                wx.showToast({
                  title: `${res.data.message}`,
                  icon: 'loading',
                  duration: 1000,
                  mask: true
                })
              }
            },
            fail: function () {
              console.log()
            }
          })
        } else {
          that.setData({
            isAccept: true
          })
        }
      },
      fail: function () {
        console.log()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _that = this
    let params = {}
    network.GET({
      params: params,
      API_URL: "/api/user/GetUserWorkState",
      success: (res) => {
        console.log(res)
        if (res.data.success) {
          console.log("获取接单状态")
          _that.setData({
            state: res.data.state
          })
        } else {
          console.log("获取状态失败")
        }
      },
      fail: function () {
        console.log()
      }
    })
  }
})