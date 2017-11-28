// pages/basicInformation/repairArea/repairArea.js
var network = require("../../utils/net.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: null,
    hiddenToast: true,
    areas: [],
    cities: [],
    repairAreas: '',
    url: '',
    showCity: false,
    areaCity: '',
    AreaStr: '',
    newArea: ''
  },
  // 选择省份
  selectPro: function (e) {
    const selectItem = e.currentTarget.dataset.item
    this.data.areas.forEach((item) => {
      item.isSelected = false
      if (selectItem.Name === item.Name) {
        item.isSelected = true
      }
    })
    var areaCity = this.data.cities.filter((city) => {
      return city.ParentId == selectItem.Id
    })
    this.setData({
      areas: this.data.areas,
      showCity: true,
      areaCity: areaCity
    })
  },
  // 选择城市
  selectCity: function (it) {
    this.data.cities.forEach((item) => {
      const selectItem = it.currentTarget.dataset.item
      if (selectItem.Name === item.Name) {
        item.isSelected = !selectItem.isSelected
      }
    });
    this.data.areaCity.forEach((item) => {
      const selectItem = it.currentTarget.dataset.item
      if (selectItem.Name === item.Name) {
        item.isSelected = !selectItem.isSelected
      }
    })
    this.setData({
      cities: this.data.cities,
      areaCity: this.data.areaCity
    })
    var selectThing = this.data.cities.filter((i) => { return i.isSelected == true }).map((index) => index.Name).join(',')
    var selectId = this.data.cities.filter((i) => { return i.isSelected == true }).map((index) => index.Id).join(',')
    this.setData({
      AreaStr: selectThing,
      newArea: selectId
    })
    console.log(this.data.newArea,'1212')
  },
  // 保存选择
  save: function () {
    console.log(11)
    let that = this
    let params = {
      areas: that.data.newArea
    }

    network.POST({
      params: params,
      API_URL: "/api/user/UpdateAreas",
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
  // 初始化
  onLoad(query) {
    // 异步请求
    var _this = this
    _this.setData({
      url: getApp().data.servsers,
      repairAreas: JSON.parse(query.item),//获取my页面传过来的维修技能数据
    })
    if (_this.data.repairAreas) {
      var Str = _this.data.repairAreas.map((item) => { return item.Name }).join(',')
      _this.setData({
        AreaStr: Str
      })
    }

    network.GET({
      params: {},
      API_URL: "/api/user/GetAllCity",
      success: (res) => {
        console.log(res.data)
        // 数组循环比对，之前选中的类目加标志提醒
        res.data.citys.forEach((item) => {
          item.isSelected = false
          _this.data.repairAreas.forEach((it) => {
            if (item.Id == it.Id) {
              item.isSelected = true
            }
          })
        })
        // 初始化数据
        var areaPro = res.data.citys.filter((item) => { return item.LevelDeep == 1 })
        var areaCity = res.data.citys.filter((item) => { return item.LevelDeep == 2 })
        _this.setData({
          areas: areaPro,
          cities: areaCity
          // oldCtegory: _this.data.repairSkill.map((item) => item.CategoryId)
        })
      },
      fail: function () {
        console.log()
      }
    })
  }
})