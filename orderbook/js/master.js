var url = "http://127.0.0.1:8000/"

var user_id = null;
user_id = 0;

function timeConvert(data) {
  return moment.unix(data).format("YYYY-MM-DD HH:mm:ss");
}

var orderCard = new Vue({
  el: '#orderCard',
  data: {
    type: 0,
    price: 0,
    amount: 0,
    total: 0
  },
  methods: {
    changePrice: function() {
      this.total = this.price * this.amount;
    },
    changeTotal: function() {
      this.amount = this.total / this.price;
    },
    changeType: function(type) {
      this.type = type;
    },
    sendMyOrder: function() {
      data = {
        user_id : user_id,
        token_id : 0,
        type : orderCard.type,
        price : orderCard.price,
        amount : orderCard.amount,
        timestamp : moment().unix()
      }
      $.ajax({
        type: 'POST',
        url: url+'order',
        data: data,
        success: this.showSuccess,
      });
    },
    showSuccess: function(data){
      $('#informationModal').modal()
    }
  }
});

var myOpenOrders = new Vue({
  el: '#myOpenOrders',
  data: {
    myOpenOrders: []
  },
  methods: {
    timeConvert: timeConvert
  }
});


var myTradeHistory = new Vue({
  el: '#myTradeHistory',
  data: {
    myTradeHistory: []
  },
  methods: {
    timeConvert: timeConvert
  }
});

var bidOrderBook = new Vue({
  el: '#bidOrderBook',
  data: {
    bidOrderBook: [],
    total: 0
  },
  methods: {
    timeConvert: timeConvert
  }
});

var sellOrderBook = new Vue({
  el: '#sellOrderBook',
  data: {
    sellOrderBook: [],
    total: 0
  },
  methods: {
    timeConvert: timeConvert
  }
});

function refreshData() {
  $.ajax({
    url: url + "explorer/order/" + user_id + "?" + "page_size=100"
  }).done(function(data) {
    myOpenOrders.myOpenOrders = data.order;
  });

  $.ajax({
    url: url + "explorer/trade/" + user_id + "?" + "page_size=100"
  }).done(function(data) {
    myTradeHistory.myTradeHistory = data.order;
  });

  $.ajax({
    url: url + "explorer/order" + "?page_size=200&token_id=0"
  }).done(function(data) {
    sellOrderBook.sellOrderBook = data.sell.reverse();
    bidOrderBook.bidOrderBook = data.buy.reverse();
    sellOrderBook.total = data.total[0];
    bidOrderBook.total = data.total[1];
  });
}
setInterval(refreshData, 1000);
