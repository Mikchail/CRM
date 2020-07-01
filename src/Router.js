;(function(){


  const api = new EventEmitter


  window.addEventListener('popstate',()=>api.emit("update"))
  api.getHashObject = function(){
      if(!location.hash){
        return {}
      }
      // console.log(JSON.parse(decodeURI(location.hash).slice(1)));
      
      return JSON.parse(decodeURI(location.hash).slice(1))
  }
  api.setHashObject = function(obj = null){
    console.log(obj);
    
      if(!obj || !Object.keys(obj).length){
        location.hash = ''
      } else {
        location.hash = JSON.stringify(obj)
      }
    }
  



  window.Router = api
})()