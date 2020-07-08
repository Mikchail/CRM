; (function () {
  const state = {
    orderId: null,
    order: null
  }

  Database.addEventListener("update", update)
  Router.addEventListener("update", update)
  init()
  update()

  function init() {
    const hashObject = Router.getHashObject()
    if (hashObject.orderId) {
      setState({
        orderId: hashObject.orderId
      })
      //   Database.addLastReviewed(hashObject.orderId)
    }
    document.querySelector('[data-save]').addEventListener('click',()=>{
      const data = new Date(document.querySelector('[data-order-date]').value)
      const update = {
        fullname: document.querySelector('[data-order-fullname]').value,
        good: document.querySelector('[data-order-good]').value,
        price: document.querySelector('[data-order-price]').value,
        status: document.querySelector('[data-order-fullname]').value,
        date: data.getTime()
      }
     
      Database.updateOrderById(state.orderId,update)
      alert('good')
    })
  }

  function update() {
    const hashObject = Router.getHashObject()
    if (hashObject.orderId && hashObject.orderId !== state.orderId) {
      setState({
        orderId: hashObject.orderId
      })
      Database.addLastReviewed(hashObject.orderId)

    }
    state.order = Database.getOrderById(hashObject.orderId)
    console.log(state)
    document.querySelector('[data-fullname]').textContent = state.order.fullname
    document.querySelector('[data-order-fullname]').value = state.order.fullname
    document.querySelector('[data-order-status]').value = state.order.status
    document.querySelector('[data-order-price]').value = state.order.price
    // todo
    document.querySelector('[data-order-good]').value = state.order.good 
    // document.querySelector('[data-order-good]').value
    const date = new Date(state.order.date);
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2,'0')
    const day = date.getDay().toString().padStart(2,'0')
    
    document.querySelector('[data-order-date]').value = `${year}-${month}-${day}`
    updateLastReviewedList()
  }


  function setState(obj) {
    Object.assign(state, obj)
    update()
  }
})()
