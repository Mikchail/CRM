const state = {
  fullname: null,
  good: null,
  status: null,
  minprice: null,
  maxprice: null,
  mindate: null,
  maxdate: null,
  orders: [],
  currentPage: 1,
  commonPage: 1
};

Database.addEventListener("update", update);
Router.addEventListener("update", ()=>{
      
  const hashObject = Router.getHashObject()
  setState(hashObject)
});
init();
update();

function init() {
  const hashObject = Router.getHashObject()
 
  byFilterNames(filterName=>{
    if(hashObject[filterName]){
      document.querySelector(`[data-filter-${filterName}]`).value = hashObject[filterName]
      state[filterName] = hashObject[filterName]
    }
    const element = document.querySelector(`[data-filter-${filterName}]`)
    
    element.addEventListener("keyup", filter)
    element.addEventListener("change", filter)
    function filter() {
      if (this.value) {
        setState({
          [filterName]: this.value
        });
      } else {
        setState({
          [filterName]: null
        });
      }
    }
  })


  if(hashObject.currentPage){
    state.currentPage = hashObject.currentPage 
  }
  

 

  const prevBtnElement = document.querySelector('[data-prev-btn]')
  const nextBtnElement = document.querySelector('[data-next-btn]')
  prevBtnElement.addEventListener('click', (e)=>{
    e.preventDefault()
    setState({
      currentPage: state.currentPage - 1
    });
  })
  nextBtnElement.addEventListener('click', (e)=>{
    e.preventDefault()
    setState({
      currentPage: state.currentPage + 1
    });
  })


  document.querySelector('[data-pagination]').addEventListener('click',(e)=>{
    e.preventDefault();
    const pageNumber = parseInt(e.target.textContent)

    if(pageNumber === state.currentPage){
      return
    }
    setState({
      currentPage: pageNumber
    });
  })
}

function update() {
  updateLastReviewedList();


  byFilterNames(filterName => {
    if(state[filterName]){
      const element = document.querySelector(`[data-filter-${filterName}]`)
      if(element.value !== state[filterName]){
        element.value = state[filterName]
      }
    }
  })
  const answer = Database.getOrders(state);
  state.orders = answer.orders;
  state.currentPage = answer.currentPage;
  state.commonPage = answer.commonPage;
  updateTable();
  updatePagination();
}
function setState(obj) {
  Object.assign(state, obj);
  const hashObject = {}
  if(state.currentPage !== 1){
    hashObject.currentPage = state.currentPage
  }
  byFilterNames(filterName =>{
    if(state[filterName]){
      hashObject[filterName] = state[filterName]
    }
  })

  Router.setHashObject(hashObject)
  update();
}

function updateTable() {
  const template = document
    .querySelector("[data-order-row]")
    .content.querySelector("tr");
  const orderListElement = document.querySelector("[data-order-list]");
  orderListElement.innerHTML = "";
  const currencyFormator = new Intl.NumberFormat("ru-Ru", {
    style: "currency",
    currency: "RUB"
  });
  const dateFormator = new Intl.DateTimeFormat("ru-Ru", {});
  for (const order of state.orders) {
    const trElement = template.cloneNode(true);

    trElement.innerHTML = trElement.innerHTML
      .replace(/%FULLNAME%/g, order.fullname)
      .replace(/%STATUS%/g, order.status)
      .replace(/%STATUS_COLOR%/g, getStatusColor(order.status))
      .replace(/%GOOD%/g, order.good)
      .replace(/%PRICE%/g, currencyFormator.format(order.price))
      .replace(/%ID%/g, order.id)
      .replace(/%DATE%/g, dateFormator.format(new Date(order.date)));
    orderListElement.append(trElement);
  }
  function getStatusColor(status) {
    if (status === "new") return "primary";
    if (status === "process") return "warning";
    if (status === "back") return "danger";
    if (status === "archived") return "dark";
  }
}


function byFilterNames(handler){
  const filterNames = ['fullname','good','status','minprice','maxprice','mindate','maxdate']
  for(const filterName of filterNames){
    handler(filterName)
  }


}

function updatePagination(){
  const numberMounter = document.querySelector('[data-pagination]')
  const prevBtnElement = document.querySelector('[data-prev-btn]')
  const nextBtnElement = document.querySelector('[data-next-btn]')
  numberMounter.innerHTML = ''
  for (let i = 0; i < state.commonPage; i++) {
    const liElement = document.createElement('li');
    liElement.classList.add('page-item');
    if(state.currentPage === i+ 1){
      liElement.classList.add('active')
    }
    const aElement = document.createElement('a');
    aElement.classList.add('page-link');
    aElement.setAttribute('href','#')
    aElement.setAttribute('data-pagenumber',i + 1)
    aElement.textContent = i + 1
    liElement.append(aElement);
    numberMounter.append(liElement)
  }
  prevBtnElement.classList.remove('disabled');
  nextBtnElement.classList.remove('disabled');
  
  if(state.currentPage === 1){
    prevBtnElement.classList.add('disabled');
  }

  if(state.currentPage === state.commonPage){
    nextBtnElement.classList.add('disabled');
  }

}

