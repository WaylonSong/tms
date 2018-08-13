var a = function(counter){
	return function(){
		console.log(counter);
	}
}

var b = (counter)=>()=>console.log(counter)
a(2)();
b(1)();