window.onload = function() {
	function $(id) {
		return document.getElementById(id);
	}

	function getByClass(element, names) {
		if (element.getElementsByClassName) {
			return element.getElementsByClassName(names);
		} else {
			var elements = element.getElementsByTagName('*');
			var result = [];
			var element,
				classNameStr,
				flag;
			names = names.split(' ');
			for (var i = 0; element = elements[i]; i++) {
				classNameStr = ' ' + element.className + ' ';
				flag = true;
				for (var j = 0, name; name = names[j]; j++) {
					if (classNameStr.indexOf(' ' + name + '') == -1) {
						flag = false;
						break;
					}
				}
				if (flag) {
					result.push(element);
				}
			}
			return result;
		}
	}
	// cookie获取设置删除
	var cookieUtil = function() {
		function getCookie(name) {
			var cookieName = encodeURIComponent(name) + '=',
				cookieStrat = document.cookie.indexOf(cookieName),
				cookieValue = null;

			if (cookieStrat > -1) {
				var cookieEnd = document.cookie.indexOf(';', cookieStrat);
				if (cookieEnd == -1) {
					cookieEnd = document.cookie.length;
				}
				cookieValue = decodeURIComponent(document.cookie.substring(cookieStrat + cookieName.length, cookieEnd));
			}
			return cookieValue;
		}

		function setCookie(name, value, expires, path, domain, secure) {
			var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			if (expires instanceof Date) {
				cookieText += "; expires" + '=' + expires.toGMTString();
			}
			if (path) {
				cookieText += "; path" + '=' + path;
			}
			if (domain) {
				cookieText += "; domain" + '=' + domain;
			}
			if (secure) {
				cookieText += '; secure';
			}
			document.cookie = cookieText;

		}

		return {
			get: function(name) {
				return getCookie(name);
			},
			set: function(name, value, expires, path, domain, secure) {
				return setCookie(name, value, expires, path, domain, secure);
			},
			remove: function(name, path, domain, secure) {
				return setCookie(name, "", new Date(0), path, domain, secure);
			}
		};
	}();

	// ajax GET方法
	var ajax = function() {
		var schStr = {};

		function ajaxGet(url, schStr, callback) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
						var data = JSON.parse(xhr.responseText);
						callback(data);
					} else {
						alert("Request was unsuccessful:" + xhr.status);
					}
				}
			}
			xhr.open("GET", addURLschStr(url, schStr), true);
			xhr.send(null);
		}
		// url 添加查询字段
		function addURLschStr(url, schStr) {
			for (name in schStr) {
				url += (url.indexOf('?') == -1 ? "?" : "&");
				if (schStr.hasOwnProperty(name)) {
					url += encodeURIComponent(name) + "=" + encodeURIComponent(schStr[name]);
				}
			}
			return url;
		}
		return {
			get: function(url, schStr, callback) {
				return ajaxGet(url, schStr, callback);
			}
		}
	}();

	// 事件处理封装
	var eventUtil = {
		addHandler: function(ele, type, handler) {
			if (ele.addEventListener) {
				ele.addEventListener(type, handler, false);
			} else if (ele.attachEvent) {
				ele.attachEvent('on' + type, handler);
			} else {
				ele['on' + type] = handler;
			}
		},
		removeHandler: function(ele, type, handler) {
			if (ele.removeEventListener) {
				ele.removeEventListener(type, handler, false);
			} else if (ele.detachEvent) {
				ele.detachEvent('on' + type, handler);
			} else {
				ele['on' + type] = null;
			}
		},
		getEvent: function(event) {
			return event ? event : window.event;
		},
		getTarget: function(event) {
			return event.target || event.srcElement;
		},
		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		}
	};
	//缓冲运动函数
	function startMove(obj, json, fn) {

		clearInterval(obj.timer);
		obj.timer = setInterval(function() {
			var flag = true;
			for (attr in json) {
				var current = 0;
				if (attr === "opacity") {
					current = Math.round(parseFloat(getStyle(obj, attr)) * 100);
				} else {
					current = parseInt(getStyle(obj, attr));
				}
				var speed = (json[attr] - current) / 10;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				if (current != json[attr]) {
					flag = false;
				}
				if (attr === "opacity") {
					obj.style.filter = "alpha(opacity:" + (current + speed) + ")";
					obj.style[attr] = (current + speed) / 100;
				} else {
					obj.style[attr] = current + speed + "px";
				}
			}
			if (flag) {
				clearInterval(obj.timer);
				if (fn) {
					fn();
				}
			}
		}, 16);
	}

	function getStyle(obj, attr) {
		if (obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return window.getComputedStyle(obj, null)[attr];
		}
	}

	function each(_objects, _fn) {
		for (var i = 0, len = _objects.length; i < len; i++) {
			_fn(_objects[i], i);
		}
	}
	// 显示，隐藏函数
	function Hide(ele) {
		ele.style.display = "none";
	}

	function Show(ele) {
		ele.style.display = '';
	}
	// 清除className
	function clearClass(ele) {
		each(ele, function(item, i) {
			item.className = '';
		});
	}
	// 不再提醒
	(function() {
		if (cookieUtil.get("tipsClose") == 1) {
			Hide($('tips-wrap'));
		}
		var tipsCloseBtn = getByClass($('tips-wrap'), 'z-close')[0];

		eventUtil.addHandler(tipsCloseBtn, 'click', function() {
			if (!cookieUtil.get("tipsClose")) {
				var date = new Date();
				date.setDate(new Date() + 1); //保存一天
				cookieUtil.set("tipsClose", 1, date); //设置cookie
				Hide($('tips-wrap')); //隐藏tips
			} else {
				return false;
			}
		});
	})();

	//关注
	var login = getByClass($('m-nav'), 'u-login')[0],
		oAdd = getByClass(login, 'login')[0],
		oCancel = getByClass(login, 'cancel')[0],
		CancelBtn = getByClass(login, 'cancel-btn')[0],
		loginBox = $('login-wrap'),
		loginBtn = getByClass(loginBox, 'login-btn')[0],
		loginClose = getByClass(loginBox, 'z-close')[0],
		bgCover = $('bg-cover');

	(function() {
		//打开登陆框
		eventUtil.addHandler(oAdd, 'click', function() {
			Show(loginBox);
			Show(bgCover);
		});
		//关闭登陆框
		eventUtil.addHandler(loginClose, 'click', function() {
			Hide(loginBox);
			Hide(bgCover);
		});
		// 登陆框
		eventUtil.addHandler(loginBtn, 'click', function() {
			var schStr = {};
			schStr.userName = hex_md5($('userName').value);
			schStr.password = hex_md5($('userPass').value);
			console.log(schStr);
			ajax.get("http://study.163.com/webDev/login.htm", schStr, function(data) {
				if (data == 1) {
					Hide(loginBox);
					Hide(bgCover);
					Hide(oAdd);
					Show(oCancel);
					var date = new Date();
					date.setDate(new Date() + 7); //保存7天
					cookieUtil.set("loginSuc", 1, date);
				} else {
					alert("账号密码错误，请重新登陆！");
				}
			});
		});
		// 取消关注
		eventUtil.addHandler(CancelBtn, 'click', function() {
			Hide(oCancel);
			Show(oAdd);
		});
	})();

	// 头图轮播
	(function(_slide) {
		var _ctrls = _slide.getElementsByTagName('i');
		var _lists = _slide.getElementsByTagName('li');
		//点击切换
		each(_ctrls, function(ctrl, i) {
			eventUtil.addHandler(ctrl, 'click', function() {
				each(_lists, function(list, i) {
					delClass(list, "z-crt");
				});
				each(_ctrls, function(ctrl, i) {
					delClass(ctrl, "z-crt");
				});
				addClass(_ctrls[i], "z-crt");
				addClass(_lists[i], "z-crt");
				curIndex = i;
			});
		});
		//自动切换
		var interval, curIndex = 0;
		timeId = null, len = _ctrls.length;
		interval = 5000;
		timeId = setInterval(autoPlay, interval);

		function autoPlay() {
			curIndex++;
			if (curIndex == len) {
				curIndex = 0;
			}
			each(_lists, function(list, i) {
				delClass(list, "z-crt");
			});
			each(_ctrls, function(ctrl, i) {
				delClass(ctrl, "z-crt");
			});
			addClass(_ctrls[curIndex], "z-crt");
			addClass(_lists[curIndex], "z-crt");
		}
		// 鼠标移入 暂停
		eventUtil.addHandler(_slide, 'mouseover', function() {
			clearInterval(timeId);
		});
		eventUtil.addHandler(_slide, 'mouseout', function() {
			clearInterval(timeId);
			timeId = setInterval(autoPlay, interval);
		});

		function hasClass(_object, _clsname) {
			var _clsname = _clsname.replace(".", "");
			var _sCls = " " + (_object.className) + " ";
			return (_sCls.indexOf(" " + _clsname + " ") != -1) ? true : false;
		}

		function toClass(_str) {
			var _str = _str.toString();
			_str = _str.replace(/(^\s*)|(\s*$)/g, "");
			_str = _str.replace(/\s{2,}/g, " ");
			return _str;
		}

		function addClass(_object, _clsname) {
			var _clsname = _clsname.replace(".", "");
			if (!hasClass(_object, _clsname)) {
				_object.className = toClass(_object.className + (" " + _clsname));
			}
		}

		function delClass(_object, _clsname) {
			var _clsname = _clsname.replace(".", "");
			if (hasClass(_object, _clsname)) {
				_object.className = toClass(_object.className.replace(new RegExp("(?:^|\\s)" + _clsname + "(?=\\s|$)", "g"), " "));
			}
		}
	})(getByClass($('g-bd'), 'slide-wrap')[0]);

	// 课程列表获取
	// var schStr = {pageNo: 1,psize: 20,type: 10};
	function lessonsGet(schStr) {
		ajax.get('http://study.163.com/webDev/couresByCategory.htm', schStr, function(data) {
			var html = ' ';
			each(data.list, function(listValue, i) {
				html += '<div class="list-wrap"><div class="list">';
				html += '<a href=' + listValue.providerLink + '><img class="list-img" src=' + listValue.middlePhotoUrl + ' /></a>';
				html += '<h3 class="list-text">' + listValue.name + '</h3>';
				html += '<p class="list-label">' + listValue.provider + '</p>';
				html += '<span class="list-count">' + listValue.learnerCount + '</span>';
				if (listValue.price === 0) {
					html += '<strong class="list-price">&nbsp;&nbsp;免费</strong>';
				} else {
					html += '<strong class="list-price">￥' + listValue.price + '</strong>';
				}
				html += '<div class="list-show clearfix" >';
				html += '<a href=' + listValue.providerLink + '><img class="show-img clearfix" src=' + listValue.middlePhotoUrl + ' /></a>';
				html += '<h3 class="name">' + listValue.name + '</h3>';
				html += '<span class="learnerCount">' + listValue.learnerCount + '</span>';
				html += '<p class="provider">发布者：' + listValue.provider + '<br>分类：' + listValue.categoryName + '</p>';
				html += '<p class="describe">' + listValue.description + '</p>';
				html += '</div></div></div>';
			});
			getByClass($('g-bd'), 'item-list')[0].innerHTML = html;
			mouseEvent();
		});
	}

	// tab切换
	var oItemBox = getByClass($('g-bd'), 'item-box')[0],
		oTab = getByClass(oItemBox, 'tab')[0],
		oPage = getByClass(oItemBox, 'm-page')[0],
		oPre = getByClass(oItemBox, 'first')[0],
		oNext = getByClass(oItemBox, 'last')[0],
		itemList = getByClass(oItemBox, 'item-list')[0],
		Lists = getByClass(itemList, 'list-wrap');
	schStr = {
		pageNo: 1,
		psize: 20,
		type: 10
	}
	lessonsGet(schStr); //课程列表初始化
	(function() {
		eventUtil.addHandler(oTab, 'click', function(event) {
			var eve = eventUtil.getEvent(event),
				target = eventUtil.getTarget(eve);
			clearClass(oTab.getElementsByTagName('span'));
			target.className = "z-crt";
			if (target.getAttribute('type') == '10') {
				schStr.type = 10;
				schStr.pageNo = 1;
				lessonsGet(schStr);
				curPge(oPage, schStr.pageNo);
			} else if (target.getAttribute('type') == '20') {
				schStr.type = 20;
				schStr.pageNo = 1;
				lessonsGet(schStr);
				curPge(oPage, schStr.pageNo);
			}
		});
		// 翻页
		eventUtil.addHandler(oNext, 'click', function(event) {
			var e = eventUtil.getEvent(event);
			eventUtil.preventDefault(e);
			NextPage(schStr);
			curPge(oPage, schStr.pageNo);
		});
		eventUtil.addHandler(oPre, 'click', function(event) {
			var e = eventUtil.getEvent(event);
			eventUtil.preventDefault(e);
			prePage(schStr);
			curPge(oPage, schStr.pageNo);
		});
		var aList = oPage.getElementsByTagName('a'),
			len = aList.length - 2;

		//点击当前页
		
		for (var i = 1; i <= len; i++) {
			aList[i].index = i;
			eventUtil.addHandler(aList[i], 'click', function(event) {
				var e = eventUtil.getEvent(event),
					target=eventUtil.getTarget(e);
				eventUtil.preventDefault(e);
				schStr.pageNo = target.index;  //这里用this IE8指向window
				curPge(oPage, schStr.pageNo);
				lessonsGet(schStr);
			});
		}
		//当前页高亮
		function curPge(oPage, pageIndex) {
			var aList = oPage.getElementsByTagName('a'),
				len = aList.length - 2,
				curIndex = null;
			if (pageIndex > len) {
				curIndex = pageIndex % len;
			} else {
				curIndex = pageIndex;
			}
			for (var i = 1; i <= len; i++) {
				aList[i].className = '';
			}
			aList[curIndex].className = "z-crt";
		}
		curPge(oPage, schStr.pageNo); //高亮初始化

	})();

	//鼠标移入移出 。事件绑定只能绑定当前页面，ajax返回的html属于另外的页面
	function mouseEvent() {
		each(Lists, function(olist, i) {
			eventUtil.addHandler(olist, "mouseover", function(event) {
				getByClass(this, 'list-show')[0].style.display = "block";
			});
			eventUtil.addHandler(olist, "mouseout", function(event) {
				getByClass(this, 'list-show')[0].style.display = "none";
			});
		});
	}

	function prePage(schStr) {
		if (schStr.pageNo == 1) {
			return false;
		} else {
			schStr.pageNo--;
			lessonsGet(schStr);
		}
	}

	function NextPage(schStr) {
		if (schStr.pageNo == 8) {
			return false;
		} else {
			schStr.pageNo++;
			lessonsGet(schStr);
		}
	}

	// 视频弹窗

	(function() {
		var oVideoBox = $('g-bd').querySelector("div.video-wrap"),
			videoBtn = document.querySelector("div.m-video").querySelector("img"),
			videoClose = oVideoBox.querySelector("i.z-close"),
			player = oVideoBox.querySelector("video");

		eventUtil.addHandler(videoBtn, "click", function() {
			Show(oVideoBox);
			Show(bgCover);
			vidoeSwitch(player);
		});
		eventUtil.addHandler(videoClose, "click", function() {
			Hide(oVideoBox);
			Hide(bgCover);
			vidoeSwitch(player);
			player.pause();
		});
		//关闭窗口视频暂停 打开继续
		function vidoeSwitch(player) {
			if (player.paused && player.currentTime > 0) { //首次打开不自动播放
				player.play();
			} else {
				player.pause();
			}
		}
	})();

	//热点排行
	(function(hotList) {
		var hotUp = hotList.querySelector('.hot-up'),
			hotDown = hotList.querySelector('.hot-down');
		//获取热点
		ajax.get("http://study.163.com/webDev/hotcouresByCategory.htm", {}, function(data) {
			var htmlup = htmldown = "";
			each(data, function(list, i) {
				if (i < 10) {
					htmlup += '<a href=' + list.providerLink + '>';
					htmlup += '<div><img src=' + list.smallPhotoUrl + ' /></div>';
					htmlup += '<p>' + list.name + '</p>';
					htmlup += '<span>' + list.learnerCount + '</span></a>';
				} else {
					htmldown += '<a href=' + list.providerLink + '>';
					htmldown += '<div><img src=' + list.smallPhotoUrl + ' /></div>';
					htmldown += '<p>' + list.name + '</p>';
					htmldown += '<span>' + list.learnerCount + '</span></a>';
				}
			});
			hotUp.innerHTML = htmlup;
			hotDown.innerHTML = htmldown;
		});
		//5s滚动
		var json = {
			top: 0
		};
		hotList.style.top = 0;
		hotList.timeId = setInterval(move, 5000);

		function move() {
			json.top -= 70;
			startMove(hotList, json, function() {
				if (json.top <= -700) {
					hotUp.style.top = 1400 + 'px';
					if (json.top <= -1400) { //复位
						hotList.style.top = 0;
						hotUp.style.top = 0;
						json.top = 0;
					}
				}
			});
		}
		//鼠标移入暂停，移出继续
		eventUtil.addHandler(hotList, 'mouseover', function() {
			clearInterval(timeId);
		});
		eventUtil.addHandler(hotList, 'mouseout', function() {
			clearInterval(timeId);
			timeId = setInterval(move, 5000);
		});
	})($("g-bd").querySelector(".hot-wrap"));
}