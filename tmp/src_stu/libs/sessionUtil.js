
let sessionUtil = {

};

sessionUtil.set = function (k, v) {
	if(typeof v == 'object'){
		sessionStorage.setItem(k,JSON.stringify(v))
	}else{
		sessionStorage.setItem(k,v)
	}
};
sessionUtil.get = function (k) {
	return sessionStorage.getItem(k)
};
sessionUtil.getObj = function (k) {
	var str = sessionStorage.getItem(k)
	return JSON.parse(str)
};

export default sessionUtil;