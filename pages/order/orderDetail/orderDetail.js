// pages/order/orderDetail/orderDetai
var network = require("../../../utils/net.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: getApp().data.servsers,
    orderDeatai: null,
    showFooter: false,
    orderId: '',
    timeLineContents: [],
    orderStateEnum: {
      '4': { name: '工作中', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-workingGreen.png' },
      '8': { name: '已完成', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-doneBlue.png' },
      '16': { name: '已关闭', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-closedDoneGray.png' },
      '32': { name: '已取消', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-cancelDarkGray.png' },
      '64': { name: '已完成', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-doneBlue.png' },
      '128': { name: '已完成', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-doneBlue.png' }
    }
  },
  // 拨打电话；
  callPhone: function (event) {
    let phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  // 跳转到工作结束页面
  orderDone: function () {
    wx.navigateTo({
      url: `workDone/workDone?orderId=${this.data.orderId}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.orderId;
    this.setData({
      orderId: options.orderId
    })
    let params = {
      atype: 2,
      id: options.orderId
    }
    network.POST({
      params: params,
      API_URL: "/api/order/get",
      success: (res) => {
        if (res.data.error) {
          wx.showToast({
            title: `${res.data.error}`,
            duration: 1000
          })
        } else {
          this.setData({
            orderDeatai: res.data,
            showFooter: res.data.state == 4 ? true : false
          })
          console.log(this.data.orderDeatai)
        }
      },
      fail: function () {
        console.log()
      }
    })
    let paramss = {
      orderId: options.orderId
    }
    network.GET({
      params: paramss,
      API_URL: "/api/order/Timeline",
      success: (res) => {
        if (res.data.error) {
          wx.showToast({
            title: `${res.data.error}`,
            duration: 1000
          })
        } else {
          this.setData({
            timeLineContents: res.data
          })
          console.log(res.data)
        }
      },
      fail: function () {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})