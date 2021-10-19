// Adding basic Index Db structure
let db;
let budgetVersion;

// Create a new db request for a "budget" database.
const request = indexedDB.open("BudgetDb", budgetVersion || 21);

request.onupgradeneeded = function (e) {
  //   console.log("Upgrade needed in IndexDB");

  // const { oldVersion } = e;
  // const newVersion = e.newVersion || db.version;

  // console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore("BudgetTransactionStore", { autoIncrement: true });
  }
};

request.onerror = function (e) {
  console.log(`Woops! ${e.target.errorCode}`);
};

function checkDatabase() {
  // Open a transaction on your BudgetTransactionStore db
  let transaction = db.transaction(["BudgetTransactionStore"], "readwrite");

  // access your BudgetTransactionStore object
  const store = transaction.objectStore("BudgetTransactionStore");

  // Get all records from store and set to a variable
  const getAll = store.getAll();

  // If the request was successful
  getAll.onsuccess = function () {
    // If there are items in the store, we need to bulk add them when we are back online
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
          // If our returned response is not empty
          if (res.length !== 0) {
            // Open another transaction to BudgetTransactionStore with the ability to read and write
            transaction = db.transaction(
              ["BudgetTransactionStore"],
              "readwrite"
            );

            // Assign the current store to a variable
            const currentStore = transaction.objectStore(
              "BudgetTransactionStore"
            );

            // Clear existing entries because our bulk add was successful
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
  // Create a transaction on the BudgetTransactionStore db with readwrite access
  const transaction = db.transaction(["BudgetTransactionStore"], "readwrite");

  // Access your BudgetTransactionStore object store
  const store = transaction.objectStore("BudgetTransactionStore");

  // Add record to your store with add method.
  store.add(record);
};
