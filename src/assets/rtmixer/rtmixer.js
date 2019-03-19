var RTMixer = {
	baseUrl: 'http://127.0.0.1:9096/anyapi/v1/',
	timer: null,
	pcListenerTimer: null,
	launched: false,
	pcClientOn: function(strAnyrtcId, appinfo, callback)
	{
		var that = this;
		//1, 先发一个请求确认是否打开了客户端
		//2，如果打开了则直接返回OK
		//3，如果没打开则调用protocol协议，同时一直请求持续30秒，如果超时则返回失败，提示用户安装应用

		that.pcListenerTimer && clearInterval(that.pcListenerTimer);
		
		this.sendPostRequest(that.baseUrl + "hello?AnyrtcID=" + strAnyrtcId, appinfo, 0, function(code, version){
			if(code == 0)
			{
				callback(code, version);
			}
			else {
				that.sendPostRequest(that.baseUrl + "hello?AnyrtcID=" + strAnyrtcId, appinfo, 10, function(code, version){
					callback(code, version);
				});
				
				if ((navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('Opera') !== -1) && that.launched) {//火狐浏览器打开应用程序会多次弹窗
						
				} else {
					var f = "mixer-launcher-frame"
							, g = document.getElementById(f);
					g || (g = document.createElement("iframe"),
					g.id = f,
					g.style.display = "none",
					document.body.appendChild(g),
					g.src = "about:blank"),
					g.contentWindow.location.href = "anymixer://hello";
	
					that.launched = true;
				}
			}
		});
	},
		
	pcListener: function(callback)
	{
		var that = this;

		that.pcListenerTimer && clearInterval(that.pcListenerTimer);

		that.pcListenerTimer = setInterval(function() {
			that.sendRequest(that.baseUrl + "hello", 0, function(code){
				if(code != 0)
				{
					callback(code);
					clearInterval(that.pcListenerTimer);
				}
			}); 
		}, 1500);
	},

	disconnect: function () {
		var that = this;
		that.sendRequest(that.baseUrl + "bye", 0, function(code){});
	},

	sendRequest (strUrl, repeat, callback) {
		var that = this;

		if (that.timer) {
			clearTimeout(that.timer);
		}

		that.timer = setTimeout(function(){
			try {
				var request = new XMLHttpRequest();
				request.onreadystatechange = function () {
					try {
						if (request.readyState == 4) {
							if (request.status == 200) {
								clearTimeout(that.timer);
								callback(0, JSON.parse(request.response).version);
							} else {
								if(repeat == 0)
								{
									callback(-2);
								}
							}
						}
					} catch (e) {
						if(repeat == 0)
						{
							callback(-2);
						} else {
							that.sendRequest(strUrl, repeat -1, callback);
						}
					}
				};
	
				request.onerror = function (e) {
					if(repeat == 0)
					{
						callback(-2);
					} else {
						that.sendRequest(strUrl, repeat -1, callback);
					}
				};
	
				request.open("GET", strUrl, false);
				request.send();
			} catch (e) {
				if(repeat == 0)
				{
					callback(-2);
				} else {
					that.sendRequest(strUrl, repeat -1, callback);
				}
			}
		}, 1000);
	},

	sendPostRequest (strUrl, appInfo, repeat, callback) {
		var that = this;

		//appInfo检测
		if (typeof appInfo !== 'object') {
			throw new Error('typeof appInfo is no object');
			return false
		}
		if (!appInfo.DevId) {
			throw new Error('DevId is null or length 0');
			return false
		}
		if (!appInfo.AppId) {
			throw new Error('AppId is null or length 0');
			return false
		}
		if (!appInfo.Key) {
			throw new Error('Key is null or length 0');
			return false
		}
		if (!appInfo.Token) {
			throw new Error('Token is null or length 0');
			return false
		}

		if (that.timer) {
			clearTimeout(that.timer);
		}

		that.timer = setTimeout(function(){
			try {
				var request = new XMLHttpRequest();
				request.onreadystatechange = function () {
					try {
						if (request.readyState == 4) {
							if (request.status == 200) {
								clearTimeout(that.timer);
								callback(0, JSON.parse(request.response).version);
							} else {
								if(repeat == 0)
								{
									callback(-2);
								}
							}
						}
					} catch (e) {
						if(repeat == 0)
						{
							callback(-2);
						} else {
							that.sendPostRequest(strUrl, appInfo, repeat -1, callback);
						}
					}
				};
	
				request.onerror = function (e) {
					if(repeat == 0)
					{
						callback(-2);
					} else {
						that.sendPostRequest(strUrl, appInfo, repeat -1, callback);
					}
				};
	
				request.open("POST", strUrl, false);
				request.send(JSON.stringify(appInfo));
			} catch (e) {
				if(repeat == 0)
				{
					callback(-2);
				} else {
					that.sendPostRequest(strUrl, appInfo, repeat -1, callback);
				}
			}
		}, 1000);
	}
};

export default RTMixer;


// WEBPACK FOOTER //
// ./src/assets/rtmixer/rtmixer.js