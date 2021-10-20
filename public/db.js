let db;
let budgetVersion;

const request = indexedDB.open("BudgetDb", budgetVersion || 21);

request.onupgradeneeded = function (e) {
  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("BudgetTransactionStore", { autoIncrement: true });
  }
};

request.onerror = function (e) {
  console.log(`Woops! ${e.target.errorCode}`);
};

function checkDatabase() {
  let transaction = db.transaction(["BudgetTransactionStore"], "readwrite");
  const store = transaction.objectStore("BudgetTransactionStore");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            transaction = db.transaction(
              ["BudgetTransactionStore"],
              "readwrite"
            );

            const currentStore = transaction.objectStore(
              "BudgetTransactionStore"
            );

            currentStore.clear();
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  db = e.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

const saveRecord = (record) => {
  const transaction = db.transaction(["BudgetTransactionStore"], "readwrite");
  const store = transaction.objectStore("BudgetTransactionStore");
  store.add(record);
};

window.addEventListener("online", checkDatabase);
