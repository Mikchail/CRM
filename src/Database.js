;(function(){

  const database = {
    lastReviewed:{
      maxLength: 4,
      orderIds: [122,22,66,21]
    },

    orders: []
  }
  load()
  const api = new EventEmitter
  api.getOrderById = function(id){
    const order = database.orders.find(x=> x.id === id)

    if(order){
      return getCopy(order)
    }

    return null
  }

  api.getLastReviewed = function(){
    return database.lastReviewed.orderIds.map(x => api.getOrderById(x))
  }
  api.addLastReviewed = function addLastReviewed(orderId){
  
    if(database.lastReviewed.orderIds.includes(orderId)){
      const index = database.lastReviewed.orderIds.indexOf(orderId)
      database.lastReviewed.orderIds.splice(index,1)
      database.lastReviewed.orderIds.unshift(orderId)
    }
    else {
      database.lastReviewed.orderIds = [orderId,...database.lastReviewed.orderIds].slice(0,database.lastReviewed.maxLength)
    }

    save()
    api.emit("update")

  }
  api.seed = function seed(orders){
    database.orders = getCopy(orders)
    save()
    api.emit("update")
  }
  window.Database = api


  function getCopy(x){
    return JSON.parse(JSON.stringify(x))
  }


  function save(){
    localStorage.setItem('__CRM_DATABASE__',JSON.stringify(database))
  }
  function load(){
   

    if(localStorage.getItem('__CRM_DATABASE__')){
      Object.assign(database,JSON.parse(localStorage.getItem('__CRM_DATABASE__')))
      console.log(database);
    }
    
  }
})()