
// pages/basicInformation/skills/skills.js
var network = require("../../utils/net.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: null,
    hiddenToast: true,
    skills: [],
    repairSkill: {},
    url: '',
    oldCtegory: '',
    newCategory: '',
    skillStr: '',
    newCategory: []
  },
  // 选择技能
  selectItem: function (e) {
    this.data.skills.forEach(item => {
      const selectItem = e.currentTarget.dataset.item
      if (selectItem.Name === item.Name) {
        item.isSelected = !selectItem.isSelected
      }
    })
    this.setData({
      skills: this.data.skills
    })
    var selectItem = this.data.skills.filter((i) => { return i.isSelected == true }).map((index) => index.Name).join(',')
    var selectId = this.data.skills.filter((i) => { return i.isSelected == true }).map((index) => index.CategoryId)

    this.setData({
      skillStr: selectItem,
      newCategory: selectId
    })

  },
  // 保存技能
  save: function () {
    let _that = this
    // 发送数据
    let params = {
      oldCategorys: _that.data.oldCtegory,
      newCategorys: _that.data.newCategory
    }
    network.POST({
      params: params,
      API_URL: "/api/user/UpdateUserSkills",
      success: (res) => {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: `${res.data.message}`,
            icon: 'success',
            duration: 1000,
            mask: true
          })
          wx.reLaunch({
            url: `/pages/my/my`,
            fail: function (res) {
              console.log(res)
            }
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
  },
  // 滚动到底部触发toast
  lower: function () {
    var that = this
    that.setData({
      hiddenToast: false
    })
    setTimeout(function () {
      that.setData({
        hiddenToast: true
      })
    }, 2000)
  },
  onLoad(query) {
    let _this = this
    _this.setData({
      url: getApp().data.servsers,
      repairSkill: JSON.parse(query.item),//获取my页面传过来的维修技能数据
    })
    if (_this.data.repairSkill) {
      var Str = _this.data.repairSkill.map((item) => { return item.Name }).join(',')
      _this.setData({
        skillStr: Str
      })
    }
    // 异步请求
    network.GET({
      params: {},
      API_URL: "/api/user/AllSkills",
      success: (res) => {
        res.data.allSkill.forEach((item) => {
          item.isSelected = false
          _this.data.repairSkill.forEach((it) => {
            if (item.CategoryId == it.CategoryId) {
              item.isSelected = true
            }
          })
        })
        // 初始化数据
        _this.setData({
          skills: res.data.allSkill,
          oldCtegory: _this.data.repairSkill.map((item) => item.CategoryId)
        })
      },
      fail: function () {
        console.log()
      }
    })
  }
})