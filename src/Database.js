;(function(){

  const database = {
    orders: [
      {
      id: 1,
      fullname: 'Михаил резниченко',
      good: 'Бумага для принтера',
      price: 500,
      status: 'new',
      date: Date.now()
    }
  ]
  }

  const api = {}
  api.getOrderById = function(id){
    const order = database.orders.find(x=> x.id === id)

    if(order){
      return getCopy(order)
    }

    return null
  }


  api.seed = function seed(orders){
    database.orders = getCopy(orders)
  }
  window.Database = api


  function getCopy(x){
    return JSON.parse(JSON.stringify(x))
  }
})()