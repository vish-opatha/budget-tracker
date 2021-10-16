// Adding basic Index Db structure
const request = indexedDB.open("budgetTrackerDB",1);
request.onsuccess = () =>{
    console.log(request.result);
}