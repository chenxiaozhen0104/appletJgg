// pages/basicInformation/basicInformation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userPhone: '',
    imgUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 获取手机图片
  // chooseImg: function () {
  //   var that = this
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: function (res) {
  //       console.log(res)
  //       var tempFilePaths = res.tempFilePaths
  //       console.log(tempFilePaths[0],'aaaaaaaaa')
  //       that.setData({
  //         imgUrl: tempFilePaths[0]
  //       })
  //     }
  //   })
  // },
  onLoad: function (options) {
    let _this = this
    // 获取用户信息
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        _this.setData({
          userInfo: res.userInfo,
          imgUrl: res.userInfo.avatarUrl
        })
      }
    })
    // 获取存储的手机号
    wx.getStorage({
      key: 'userPhone',
      success: function (res) {
        console.log(res.data)
        _this.setData({
          userPhone: res.data
        })

      }
    })

  }

})