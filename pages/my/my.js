// pages/my/my.js
var network = require("../../utils/net.js")
Page({
  // 页面的初始数据
  data: {
    userInfo: {},
    userPhone: '',
    url: getApp().data.servsers,
    repairSkills: '',
    repairSkill: [],
    repairAreas: '',
    repairArea: [],
    showToast: false
  },
  // 跳转到维修技能页面
  repairSkill: function () {
    let that = this
    var skills = JSON.stringify(that.data.repairSkill)
    wx.navigateTo({
      url: `/pages/skills/skills?item=${skills}`,
      fail: function (res) {
        console.log(res)
      }
    })
  },
  // 跳转到维修区域页面
  repairArea: function () {
    let that = this
    var areas = JSON.stringify(that.data.repairArea)
    wx.navigateTo({
      url: `/pages/repairArea/repairArea?item=${areas}`,
      fail: function (res) {
        console.log(res)
      }
    })
    console.log(areas)
  },
  // 获取维修技能
  init: function () {
    network.GET({
      params: {},
      API_URL: "/api/user/UserInfo",
      success: (res) => {
        if (res.data.repairArea) {
          this.setData({
            repairArea: res.data.repairArea,
            repairAreas: res.data.repairArea.map((item) => item.Name).join(',')
          })
        } else {
          this.setData({
            repairAreas: '暂无',
          })
        }
        if (res.data.skill) {
          this.setData({
            repairSkill: res.data.skill,
            repairSkills: res.data.skill.map((item) => item.Name).join(',')
          })
        } else {
          this.setData({
            repairAreas: '暂无',
          })
        }
      },
      fail: function () {
        console.log()
      }
    })
  },
  onLoad: function () {
    let _this = this
    // init方法初始化
    _this.init()
    // 获取用户信息
    wx.getUserInfo({
      success: function (res) {
        _this.setData({
          userInfo: res.userInfo
        })
      },
      fail: function (res) {
        // 重新开启获取用户信息的权限
        _this.setData({
          showToast: true
        })
        wx.openSetting({
          success: (res) => {
            _this.setData({
              showToast: false
            })
            res.authSetting = {
              "scope.userInfo": true
            }

          }
        })
      }
    })
    // 获取存储的手机号
    wx.getStorage({
      key: 'userPhone',
      success: function (res) {
        _this.setData({
          userPhone: res.data
        })
      }
    })

  }
})