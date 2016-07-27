var vkUser = /\w+\/([\w\.]+)/.exec(location.href);
var VKUSER = vkUser && vkUser[1];
console.log('vk user: ' + VKUSER);

var SEARCHTAG = '#weareinfinite';

function jsonpVKrequest(api_url, api_data, callback) {
	$.ajax({
	 type: "GET",
	 url: api_url,
	 crossDomain: true,
	 contentType: "application/json; charset=utf-8",
	 data: api_data,
	 dataType: "jsonp", 
	 success: callback
	});
}

function usersGet_res(data){
	console.log('User Data: ', data);
	if (data && data.response) {
		data = data.response[0];

		$('.d-username').html('<a href="https://vk.com/' + VKUSER + '" target="blank_" >' + data.first_name + ' ' + data.last_name + '</a>');
		$('.d-avatar').attr('src', data.photo_max_orig || data.photo_max || data.photo_400_orig);
		console.log(data.status);
		if (data.status)
			$('.d-status').html('&laquo;' + data.status + '&raquo;'); 
	} else {

		console.log('VK ERROR: No VK USER!');

	}
	
}

function wallSearch_res(data) {
	console.log('Wall Data: ', data);
	if (data && data.response && data.response[1])
		data = data.response[1];

	if (data.text && data.text.substr(0, SEARCHTAG.length) === SEARCHTAG ) { //

	
		var txt = data.text.replace(/#\w+/, '').replace(/<br>/, '');
		var hasTitle = txt.split('<br><br>');
		if (hasTitle && hasTitle[1]) {
			var title = hasTitle[0],
				txt = hasTitle[1]
					$('.d-title').text(title);
		} 
		if (txt && !title) 
			$('.d-title').text('');
		
		$('.d-text').text(txt);			
	}
}

jsonpVKrequest("https://api.vk.com/method/users.get", 
    { 
     user_ids: VKUSER,
     fields: 'status, photo_400_orig, photo_max, photo_max_orig'
    }, 
   usersGet_res);

jsonpVKrequest("https://api.vk.com/method/wall.search", 
    { 
     domain: VKUSER,
     query: '#weareinfinite'
    }, 
   wallSearch_res)
		
