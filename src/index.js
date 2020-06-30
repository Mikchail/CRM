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
init();
update();

function init() {
  document
    .querySelector("[data-filter-maxprice]")
    .addEventListener("keyup", function() {
      if (this.value) {
        setState({
          maxprice: this.value
        });
      } else {
        setState({
          maxprice: null
        });
      }
    });
    document
    .querySelector("[data-filter-minprice]")
    .addEventListener("keyup", function() {
      if (this.value) {
        setState({
          minprice: this.value
        });
      } else {
        setState({
          minprice: null
        });
      }
    });
    document
    .querySelector("[data-filter-fullname]")
    .addEventListener("keyup", function() {
      if (this.value) {
        setState({
          fullname: this.value
        });
      } else {
        setState({
          fullname: null
        });
      }
    });
  document
    .querySelector("[data-filter-good]")
    .addEventListener("change", function() {
      if (this.value) {
        setState({
          good: this.value
        });
      } else {
        setState({
          good: null
        });
      }
    });
    document
    .querySelector("[data-filter-maxdate]")
    .addEventListener("change", function() {
      if (this.value) {
        setState({
          maxdate: new Date(this.value).getTime()
        });
      } else {
        setState({
          maxdate: null
        });
      }
    });
    document
    .querySelector("[data-filter-mindate]")
    .addEventListener("change", function() {
      if (this.value) {
        setState({
          mindate: new Date(this.value).getTime()
        });
      } else {
        setState({
          mindate: null
        });
      }
    });
    document
    .querySelector("[data-filter-status]")
    .addEventListener("change", function() {
      if (this.value) {
        console.log(this.value);
        
        setState({
          status: this.value
        });
      } else {
        setState({
          status: null
        });
      }
    });
}
function update() {
  updateLastReviewedList();
  const answer = Database.getOrders(state);
  state.orders = answer.orders;
  state.currentPage = answer.currentPage;
  state.commonPage = answer.commonPage;
  updateTable();
}
function setState(obj) {
  Object.assign(state, obj);
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
