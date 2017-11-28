// pages/order/orderDetail/workDone/workDone.js
var network = require("../../../../utils/net.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: getApp().data.servsers,
    orderId: '',
    status: [{ name: '完成', val: 8, placeholder: '请输入完成工作备注...', submit: '完成工作', description: '' },
    { name: '关闭', val: 16, placeholder: '请输入关闭工单原因...', submit: '确认关闭工单', description: '' }],
    selectStatus: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.selectStatus = this.data.status[0];
    this.setData({
      selectStatus: this.data.selectStatus,
      orderId: options.orderId
    })
  },
  selectedItems: function (event) {
    this.setData({
      selectStatus: event.currentTarget.dataset.item
    })
  },
  formSubmit: function (e) {
    let describle = e.detail.value.textarea
    if (!describle) {
      wx.showToast({
        title: '备注内容不能为空吆！',
        duration: 1000
      })
      return
    } else {
      let params = {
        orderId: this.data.orderId,
        description: describle,
        state: this.data.selectStatus.val,
        level: 5,
        amount: '',
        toUserId: '',
        appType: 2
      }
      network.POST({
        params: params,
        API_URL: "/api/order/submitstate",
        success: (res) => {
          wx.showToast({
            title: res.data.success,
            duration: 1000
          })
          setTimeout(() => {
            wx.reLaunch({
              url: "../../order"
            })
          }, 1000)
        },
        fail: function () {
          console.log()
        }
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