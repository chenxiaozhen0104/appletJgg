// pages/order/order.js
var network = require("../../utils/net.js")
var loading = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 1000,
    showStatus: false,
    url: getApp().data.servsers,
    curState: 4,
    pageIndex: 1,
    hasMore: false,
    hidden: false,
    hasRefesh: false,
    orderData: [],
    menu: {
      processing: {
        isChoose: true,
        state: 4,
        name: '进行中',
        num: 0
      },
      processed: {
        isChoose: false,
        name: '已完成',
        state: 8 + 64 + 128,
        num: 0
      },
      all: {
        name: '全部',
        isChoose: false,
        state: 4 + 8 + 16 + 32 + 64 + 128,
        num: 0
      }
    },
    orderStateEnum: {
      '4': { name: '工作中', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-workingGreen.png' },
      '8': { name: '已完成', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-doneBlue.png' },
      '16': { name: '已关闭', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-closedDoneGray.png' },
      '32': { name: '已取消', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-cancelDarkGray.png' },
      '64': { name: '已完成', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-doneBlue.png' },
      '128': { name: '已完成', src: 'http://img.zmnbx.com//dist/Images/zmnbx2.0.1-doneBlue.png' }
    }
  },
  /**
   * 
   * tab切换
   */
  menuClick: function (e) {
    let ItemType = e.currentTarget.dataset.type;
    this.data.menu.processing.isChoose = false;
    this.data.menu.processed.isChoose = false;
    this.data.menu.all.isChoose = false;
    this.data.curState = this.data.menu[ItemType].state;
    this.data.menu[ItemType].isChoose = true;
    this.setData({
      showStatus: this.data.showStatus,
      curState: this.data.curState,
      menu: this.data.menu,
      orderData: [],
      pageIndex: 1
    })
    this.init();
  },
  // 工单详情跳转
  jumpDetail: function (event) {
    let orderId = event.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `orderDetail/orderDetail?orderId=${orderId}`
    })
  },
  // 上拉刷新 
  refesh: function () {
    this.setData({
      pageIndex: 1,
      orderData: []
    })
    this.init();
    this.getOrderNum();
  },
  // 加载更多；
  loadMore: function () {


    if (!loading) {
      loading = true
      this.init();
    }
  },
  /**
   *初始化数据请求
   */
  init: function () {
    this.setData({
      hasMore: true,
      hidden: false,
      hasRefesh: true
    })
    let params = {
      state: this.data.curState,
      atype: 2,
      pageIndex: this.data.pageIndex,
      pageSize: 10
    }
    console.log(params)

    network.POST({
      params: params,
      API_URL: "/api/order/search",
      success: (res) => {

        this.setData({
          hasRefesh: false,
          hasMore: false
        })
        let total = Math.ceil(res.data.count / 5)
        console.log(total)
        if (this.data.pageIndex <= total) {
          this.setData({
            orderData: this.data.orderData.concat(res.data.data),
            pageIndex: ++this.data.pageIndex
          })
        } else {
          console.log('隐藏')
          this.setData({
            hidden: true,
          })
        }
        setTimeout(() => { loading = false }, 300)
      },
      fail: function () {
        loading = false
      }
    })
  },
  getOrderNum: function () {
    let params = {
      atype: 2
    }
    network.POST({
      params: params,
      API_URL: "/api/order/GetOrderStateNum",
      success: (res) => {
        var orderNum = res.data;
        this.data.menu.processing.num = 0;
        this.data.menu.all.num = 0;
        this.data.menu.processed.num = 0;
        for (let i = 0; i < orderNum.length; i++) {
          this.data.menu.all.num += orderNum[i].Num
          if (orderNum[i].State == 4) {
            this.data.menu.processing.num += orderNum[i].Num;
          } else if (orderNum[i].State == 8 || orderNum[i].State == 64 || orderNum[i].State == 128) {
            this.data.menu.processed.num += orderNum[i].Num;
          }
        }
        this.setData({
          menu: this.data.menu
        })

      },
      fail: function () {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('order')
    this.setData({
      scrollViewHeight: wx.getSystemInfoSync().windowHeight
    })
    this.init();
    this.getOrderNum();
  }
})