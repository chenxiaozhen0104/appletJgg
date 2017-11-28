// pages/login/login.js

var network = require("../../utils/net.js")
console.log(network)

Page({
  data: {
    disabled: false,
    btnCodeText: "获取验证码",
    telephone: "",
    codePhone: "",
    url: getApp().data.servsers,
    token: ''
  },
  // 获取验证码
  changeCode: function () {
    var _this = this
    var time = 60
    // 判断手机格式
    let telephone = this.data.telephone
    if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(telephone))) {
      wx.showToast({
        title: '手机格式不正确',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
      return
    }
    this.setData({
      disabled: true
    })
    let clearId = setInterval(() => {
      if (time > 0) {
        this.setData({
          btnCodeText: `${time}s 后重试`
        })
        time--
      } else {
        this.setData({
          btnCodeText: `获取验证码`
        })
        clearInterval(clearId)
        this.setData({
          disabled: false
        })
      }
    }, 1000)
    //发送短信验证码

    let params = {
      mobile: _this.data.telephone,
      verifyUser: !!_this.verifyUser
    }
    network.GET({
      params: params,
      API_URL: "/api/common/sendverifycode",
      success: (res) => {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'loading',
            duration: 1000,
            mask: true
          })
          this.setData({
            btnCodeText: `获取验证码`
          })
          clearInterval(clearId)
          this.setData({
            disabled: false
          })
        }
      },
      fail: function () {
        console.log()
      }
    })
  },
  // 绑定事件
  bindPhone: function () {
    let _this = this
    let params = {
      realName: _this.data.name,
      mobile: _this.data.telephone,
      smsCode: _this.data.codePhone
    }
    network.POST({
      params: params,
      API_URL: "/Api/User/WxBindUser",
      success: (res) => {
        console.log(res)
        if (res.data.success) {
          wx.reLaunch({
            url: '/pages/home/home',
            fail: function (res) {
              console.log(res)
            }
          })
          wx.showToast({
            title: `${res.data.message}`,
            icon: 'success',
            duration: 1000,
            mask: true
          })
          wx.setStorage({
            key: "userPhone",
            data: _this.data.telephone
          })
          // wx.getStorage({
          //   key: 'userPhone',
          //   success: function (res) {
          //     console.log(res.data)
          //   }
          // })
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
  },
  // 页面初始化
  onLoad: function () {
    let that = this
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          let params = {
            code: res.code
          }
          network.POST({
            params: params,
            API_URL: "/Api/User/GetTokenJsCode",
            success: (res) => {
              var token = res.data.token
              wx.setStorage({
                key: "token",
                data: token
              })
            },
            fail: function () {
              console.log()
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  nameinput(e) {
    let value = e.detail.value
    console.log(e.detail.value)
    this.setData({
      name: value
    })
  },
  phoneinput(e) {
    let value = e.detail.value
    this.setData({
      telephone: value
    })
  },
  codeinput(e) {
    let value = e.detail.value
    this.setData({
      codePhone: value
    })
  }

})
