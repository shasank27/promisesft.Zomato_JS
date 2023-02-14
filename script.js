let isValetFound = false;
let isOrderAccepted = false;
let isOrderDelivered = false;
let hasRestaurantSeenYourOrder = false;
let restaurantTimer = null;
let valetDeliveryTimer = null;
let valetTimer = null;

window.addEventListener("load", () => {
  document.getElementById("acceptOrder").addEventListener("click", () => {
    askRestaurantToAcceptOrReject();
  });
  document.getElementById("findValet").addEventListener("click", () => {
    startSearchingforDeliveryPartners();
  });
  document.getElementById("deliverOrder").addEventListener("click", () => {
    setTimeout(() => {
      isOrderDelivered = true;
    }, 2000);
  });

  checkIfOrderAccepted()
    .then(res => {
      if (res) {
        alert("Your order has been accepted");
        startPreparingOrder();
      } else alert("Sorry! coundn't fulfill your order");
    })
    .catch(err => {
      console.log(err);
      alert("Something went wrong, try again later");
    });
});

function askRestaurantToAcceptOrReject() {
  setTimeout(() => {
    isOrderAccepted = confirm("Should Restaurant accept order?");
    hasRestaurantSeenYourOrder = true;
    console.log(isOrderAccepted);
  }, 1000);
}

function checkIfOrderAccepted() {
  var promise = new Promise((resolve, reject) => {
    setInterval(() => {
      if (!hasRestaurantSeenYourOrder) return;
      if (isOrderAccepted) resolve(true);
      else resolve(false);
    }, 2000);
  });
  return promise;
}

function startPreparingOrder() {
  Promise.all([
    updateOrderStatus(),
    updateMapView(),
    checkIfValetAssigned(),
    checkIfOrderDelivered(),
  ])
    .then(res => {
      console.log(res);
      setTimeout(() => {
        alert("How was your food?");
      }, 2000);
    })
    .catch(err => {
      console.log(err);
    });
}

function updateOrderStatus() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById("currentStatus").innerText = isOrderDelivered
        ? "Order Delivered"
        : "Preparing your order";
      resolve("status updated");
    }, 1000);
  });
}

function updateMapView() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById("mapview").style.opacity = "1";
      resolve("map initialised");
    }, 1200);
  });
}

function startSearchingforDeliveryPartners() {
  var valets = [];
  for (let i = 0; i < 5; i++) {
    valets.push(getRandomValet());
  }
  console.log(valets);

  Promise.any(valets)
    .then(selectedValet => {
      console.log("Selected a valet => ", selectedValet);
      isValetFound = true;
    })
    .catch(err => console.log(err));
}

function getRandomValet() {
  return new Promise((resolve, reject) => {
    const timeout = Math.random() * 1000;
    setTimeout(() => {
      resolve("Valet - " + timeout);
    }, timeout);
  });
}

function checkIfOrderDelivered() {
  console.log(isOrderDelivered, "checkIfOrderDelivered()");
  return new Promise((resolve, reject) => {
    valetDeliveryTimer = setInterval(() => {
      console.log("is order delivered by valet");
      if (isOrderDelivered) {
        resolve("order delivered valet details");
        updateOrderStatus();
        clearTimeout(valetDeliveryTimer);
      }
    }, 1000);
  });
}

function checkIfValetAssigned() {
  return new Promise((resolve, reject) => {
    valetTimer = setInterval(() => {
      console.log(" searching for valet");
      if (isValetFound) {
        updateValetDetails();
        resolve("updated valet details");
        clearTimeout(valetTimer);
      }
    }, 1000);
  });
}

function updateValetDetails() {
  if (isValetFound) {
    document.getElementById("finding-driver").classList.add("none");
    document.getElementById("found-driver").classList.remove("none");
    document.getElementById("call").classList.remove("none");
  }
}

// Promise - then,catch.   Callback - resolve, reject
// Types of promise -
// 1. Promise.all - saare operations call paralley, if one fails, promise.all fails
// 2. Promise.allsettled - saare operations call paralley, if one fails - dont give a damn, promise.allsettles passes
// 3. Promise.race - first promise to complete - whether it is resolved or rejected
// 4. Promise.any - first promise to fullfil that is resolved/fullfilled
