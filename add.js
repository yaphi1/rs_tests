function add(a){
	if(arguments[1]){
		return Array.prototype.slice.call(arguments).reduce(function(prev,tot){return prev+tot;});
	}
	var total = a;

	function totalIt(n){
		if(n){
			total+=n;
			// console.log('total: '+total);
			return totalIt;
		}
		else{
			return total;
		}
	}
	return totalIt;
}


//usage
add(1,2,3,4);
add(1)(2)(3)(4)();