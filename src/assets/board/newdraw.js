function EventEmitter () {
	this.events = {};

	//绑定事件函数
	this.on = function (eventName, callback) {
		if (eventName) {
			this.events[eventName] = this.events[eventName] || [];
			this.events[eventName].push(callback);
		}
	};
	//触发事件函数
	this.emit = function (eventName, _) {
		var events = this.events[eventName],
			args = Array.prototype.slice.call(arguments, 1),
			i, m;

		if (!events) {
			return;
		}
		for (i = 0, m = events.length; i < m; i++) {
			events[i].apply(null, args);
		}
	};
}



function Canvas (el, elBox) {
	var that = this;

	EventEmitter.call(that);

	this.el = el;
	this.elBox = elBox;
	this.ctx = el.getContext("2d");

	// 默认配置
	this.isEdit = false;            //是否可编辑(监听下笔)
	this.candraw = false;			//画笔是否可以移动（监听移动）
	this.eType = 0;
	this.width = el.getBoundingClientRect().width;
	this.height = el.getBoundingClientRect().height;
	this.el.width = this.width;
	this.el.height = this.height;

	// this.sHeight = 0;			//浏览器滚动的距离，会造成画板偏差，所以要减去
	this.lineWidth = 1;
	this.color = "#000000";
	this.scale = 1;

	//
	this.xStart = 0;
	this.yStart = 0;
	this.xStop = 0;
	this.yStop = 0;
	this.canvasData = {};
	this.jPoint = [];

	// 存储图片队列
	this.dataQueue = [];

	// anyRTC
	this.boardData = [];            // 所有人的数据
	this.boardLocalIdList = [];     // 本地画笔id数组
	this.doneQueue = [];            // 自己在画时接受到所有的还未画的数据

	// 返回随机字符串
	this.randomString = function (nLen) {
		var len = nLen || 8,
			string = "",
			strArr = "abcdefghijklmnopqrstuvwxyz123456789";

		for (var i=0; i<len; i++) {
			string += strArr.split('')[parseInt(strArr.length * Math.random())];
		}

		return "web:"+string
	};

	this.getPosition = function (obj){
        var l=0;
        var t=0;
        while(obj){
            l+=obj.offsetLeft;
            t+=obj.offsetTop;
            obj=obj.offsetParent;
        }
        return {offsetLeft:l, offsetTop:t};
    };

	this.el.onmousedown = function (e) {
		if (that.isEdit) {
			if (e.button === 0) {
				var xDown = e.clientX,
					yDown = e.clientY;

				var canvasOffsetLeft = that.el.offsetLeft,
					canvasOffsetTop = that.el.offsetTop;

				// console.log(e.clientX, e.clientY);
				// console.log(that.el.getBoundingClientRect());
				// console.log(e.clientX - that.el.getBoundingClientRect().x, e.clientY - that.el.getBoundingClientRect().y);

				// 计算开始坐标
				// that.xStart = xDown - that.getPosition(that.el).offsetLeft - canvasOffsetLeft + window.pageXOffset;
				// that.yStart = yDown - that.getPosition(that.el).offsetTop - canvasOffsetTop + window.pageYOffset + that.elBox.scrollTop;//浏览器滚动的距离，会造成画板偏差，所以要加上
				that.xStart = xDown - that.el.getBoundingClientRect().x + window.pageXOffset;
				that.yStart = yDown - that.el.getBoundingClientRect().y + window.pageYOffset + that.elBox.scrollTop;//浏览器滚动的距离，会造成画板偏差，所以要加上

				// 设置canvas数据
				that.canvasData = {};
				that.canvasData['DType'] = that.eType;
				that.canvasData['DWidth'] = that.lineWidth;
				that.canvasData['DColor'] = that.color;
				that.canvasData['DCanvasWidth'] = that.width;
				that.canvasData['DCanvasHeight'] = that.height;
				that.canvasData['DStartX'] = that.xStart;
				that.canvasData['DStartY'] = that.yStart;

				// 清除涂鸦的数组
				that.jPoint = [];

				that.candraw = true;
			}
		} else {
			that.emit('onBoardDisabled');
		}
	};

	this.el.onmousemove = function (e) {
		if (that.candraw) {
			var canvasOffsetLeft = that.el.offsetLeft,
				canvasOffsetTop = that.el.offsetTop;

			// 计算此时的坐标
			// var xUp = e.clientX - that.getPosition(that.el).offsetLeft - canvasOffsetLeft + window.pageXOffset,
			// 	yUp = e.clientY - that.getPosition(that.el).offsetTop - canvasOffsetTop + window.pageYOffset + that.elBox.scrollTop;
			var xUp = e.clientX - that.el.getBoundingClientRect().x  + window.pageXOffset,
				yUp = e.clientY - that.el.getBoundingClientRect().y + window.pageYOffset + that.elBox.scrollTop;

			that.xStop = xUp;
			that.yStop = yUp;

			if (that.eType === 0) {
				// 设置canvas绘画数据
				if (that.jPoint === undefined || that.jPoint === null || that.jPoint.length === 0) {
					that.jPoint.push([that.xStart, that.yStart]);
					that.jPoint.push([xUp, yUp]);
				} else {
					that.jPoint.push([xUp, yUp]);
				}
				that.canvasData['DPoint'] = JSON.stringify(that.jPoint);
			} else {
				that.canvasData['DPoint'] = "";

				that.ctx.clearRect(0, 0,that.width,that.height);
				if(that.dataQueue.length!=0){
					that.ctx.putImageData(that.dataQueue[that.dataQueue.length-1], 0, 0, 0, 0, that.width, that.height);
				}
			}
			// 开始结束坐标
			that.canvasData['DEndX'] = xUp;
			that.canvasData['DEndY'] = yUp;

			// console.log(that.canvasData);
			that[that.returnStrType(that.eType)](that.canvasData);
		}
	};

	this.el.onmouseout = this.el.onmouseup = function (e) {
		if (that.candraw) {
			if (that.canvasData['DEndX'] === "" || that.canvasData['DEndX'] === null || that.canvasData['DEndX'] === undefined) {
				that.canvasData['DEndX'] = that.xStart;
			}
			if (that.canvasData['DEndY'] === "" || that.canvasData['DEndY'] === null || that.canvasData['DEndY'] === undefined) {
				that.canvasData['DEndY'] = that.yStart;
			}

			that.save();
			that.candraw = false;
			// 画笔抬起回调
			// that.emit('done', that.canvasData, that.boardLocalIdList[that.boardLocalIdList.length - 1]);
			that.emit('done', that.canvasData, "web:board_localid" + that.randomString(16));

			// 检查等待队列中是否还有没有画的
			if (that.doneQueue.length !== 0) {
				that.strokeBoard(that.doneQueue);
			}
		}
	};
}

/**
 *  监听滚动事件，防止滚动后画笔错位
 */
// Canvas.prototype.addListener = function (el, callback) {
// 	var that = this;
// 	function scrollFunc (e) {
// 		console.log(e.clientY);
// 		that.sHeight = el.scrollTop;
// 		// that.sHeight = e.clientY - (el.scrollHeight - el.clientHeight);
// 		console.log(that.scrollHeight);
// 	}
// 	if(document.addEventListener){
// 	   el.addEventListener('DOMMouseScroll',scrollFunc,false);
// 	}//W3C
//    	el.onmousewheel = el.onmousewheel = scrollFunc; //IE/Opera/Chrome/Safari
// };
/**
 *  枚举int类型
 */
Canvas.prototype.returnNType = function (type) {
	var nType;
	switch (type) {
		case "draw":
			nType = 0;
			break;
		case "arrow":
			nType = 1;
			break;
		case "line":
			nType = 2;
			break;
		case "rect":
			nType = 3;
			break;
	}

	return nType
};
/**
 *  矩形String类型
 */
Canvas.prototype.returnStrType = function (type) {
	var nType;
	switch (type) {
		case 0:
			nType = "draw";
			break;
		case 1:
			nType = "arrow";
			break;
		case 2:
			nType = "line";
			break;
		case 3:
			nType = "rect";
			break;
	}

	return nType
};
/**
 *  设置画笔类型
 */
Canvas.prototype.setDrawType = function (nType) {
	this.eType = nType;
};
/**
 *  设置线的宽度
 */
Canvas.prototype.setLineWidth = function (nWidth) {
	this.lineWidth = nWidth;
};
/**
 *  设置颜色
 */
Canvas.prototype.setColor = function (strColr) {
	this.color = strColr;
};
/**
 *  涂鸦
 */
Canvas.prototype.draw = function (boardData) {
	var that = this, topCtx = that.ctx;

	let scale = that.width/boardData.DCanvasWidth;

	topCtx.lineCap = "round";
	topCtx.strokeStyle = boardData.DColor ? boardData.DColor : that.color;
	topCtx.lineWidth = boardData.DWidth ? boardData.DWidth * scale : that.lineWidth * scale;

	if (!boardData.DPoint) {
		return
	}

	let point;
	if (typeof boardData.DPoint === "string") {
		point = JSON.parse(boardData.DPoint);
	} else if (typeof boardData.DPoint === "object") {
		point = boardData.DPoint;
	}
	if (point.length !== 0) {
		for (var j =0; j<point.length-1; j++) {
			topCtx.beginPath();

			// topCtx.moveTo(xStart, yStart);
			// topCtx.lineTo(xStop, yStop);
			topCtx.moveTo(point[j][0] * scale, point[j][1] * scale);
			topCtx.lineTo(point[j+1][0] * scale, point[j+1][1] * scale);

			topCtx.stroke();
			topCtx.closePath();
		}
	}
};
/**
 *  直线
 */
Canvas.prototype.line = function (boardData) {
	var that = this,
		topCtx = that.ctx;

	let scale = that.width/boardData.DCanvasWidth;

	topCtx.beginPath();

	topCtx.lineCap = "round";
	topCtx.strokeStyle = boardData.DColor ? boardData.DColor : that.color;
	topCtx.lineWidth = boardData.DWidth ? boardData.DWidth * scale : that.lineWidth * scale;

	topCtx.moveTo(boardData.DStartX * scale , boardData.DStartY * scale);
	topCtx.lineTo(boardData.DEndX * scale, boardData.DEndY * scale);
	topCtx.stroke();
};
/**
 *  矩形
 */
Canvas.prototype.rect = function (boardData) {
	var that = this,
		xMoved, yMoved,
		rectWidth, rectHeight,
		topCtx = that.ctx;

	let scale = that.width/boardData.DCanvasWidth,
		xStart = boardData.DStartX * scale,
		yStart = boardData.DStartY * scale,
		xStop = boardData.DEndX * scale,
		yStop = boardData.DEndY * scale;

	xMoved = xStop - xStart;
	yMoved = yStop - yStart;
	rectWidth = Math.abs(xMoved);
	rectHeight = Math.abs(yMoved);

	topCtx.beginPath();

	topCtx.strokeStyle = boardData.DColor ? boardData.DColor : that.color;
	topCtx.lineWidth = boardData.DWidth ? boardData.DWidth * scale : that.lineWidth * scale;

	topCtx.rect((xStop >= xStart ? xStart : xStop), (yStop >= yStart ? yStart : yStop), rectWidth, rectHeight);
	topCtx.stroke();
};
/**
 *  箭头
 */
Canvas.prototype.arrow = function (boardData) {
	var that = this,
		topCtx = that.ctx;

	let scale = that.width/boardData.DCanvasWidth,
		xStart = boardData.DStartX * scale,
		yStart = boardData.DStartY * scale,
		xStop = boardData.DEndX * scale,
		yStop = boardData.DEndY * scale;

	var theta = 30;
	var headlen = 10;
	var width = boardData.DWidth ? boardData.DWidth * scale : that.lineWidth * scale;
	var color = boardData.DColor ? boardData.DColor : that.color;

	// 计算各角度和对应的P2,P3坐标
	var angle = Math.atan2(yStart - yStop, xStart - xStop) * 180 / Math.PI,
		angle1 = (angle + theta) * Math.PI / 180,
		angle2 = (angle - theta) * Math.PI / 180,
		topX = headlen * Math.cos(angle1),
		topY = headlen * Math.sin(angle1),
		botX = headlen * Math.cos(angle2),
		botY = headlen * Math.sin(angle2);

	topCtx.save();
	topCtx.beginPath();

	// 画箭头两侧线条
	var arrowX = xStart - topX, arrowY = yStart - topY;
	topCtx.moveTo(arrowX, arrowY);
	topCtx.moveTo(xStart, yStart);
	topCtx.lineTo(xStop, yStop);

	// 画直线
	arrowX = xStop + topX; arrowY = yStop + topY;
	topCtx.moveTo(arrowX, arrowY);
	topCtx.lineTo(xStop, yStop);

	arrowX = xStop + botX;
	arrowY = yStop + botY;
	topCtx.lineTo(arrowX, arrowY);

	topCtx.strokeStyle = color;
	topCtx.lineWidth = width;
	topCtx.stroke();

	topCtx.restore();
};
/**
 *  打开关闭画板是否可编辑
 */
Canvas.prototype.switchEdit = function (bEdit) {
	var that = this;

	if (typeof bEdit !== "boolean") {
		that.emit('onBoardError', 'switchEdit', {msg: 'type of bEdit is not boolean.'});
	}
	that.isEdit = bEdit;
};

Canvas.prototype.save = function () {
	var that = this;

	// 添加本地画笔，方便撤销
	// that.boardLocalIdList.push("web:board_localid" + that.randomString(16));

	// 队列
	that.dataQueue.push(that.ctx.getImageData(0, 0, that.width, that.height));
};

/**
 *  保存文件
 */
Canvas.prototype.saveFile = function (filename) {
	var that = this;

	var imgObj = new Image();
	imgObj.crossOrigin = 'Anonymous';

	imgObj.onload = function () {
		var newCanvas = document.createElement('canvas');
		var newCtx = newCanvas.getContext('2d');

		newCanvas.width = 800;
		newCanvas.height = 600;
		newCtx.drawImage(imgObj, 0 , 0);

		//替换掉
		newCtx.beginPath();
		newCtx.lineWidth="10";
		newCtx.strokeStyle="blue";
		newCtx.rect(50,50,150,80);
		newCtx.stroke();
		
		var imgData = newCanvas.toDataURL("image/png");
		// var imgData = newCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		
		//下载
		var save_link = document.createElement('a');
		save_link.href = imgData;
		save_link.download = filename;
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		save_link.dispatchEvent(event);
	}
	// imgObj.src = "https://ubmcmm.baidustatic.com/media/v1/0f000PLUkiK1Y8Xo7ncyGf.jpg";
	imgObj.src = "http://oss.teameeting.cn/docs/010884893/20180629174813795629/document_20180629174813607084_1.jpg";
	// imgObj.src = "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epc6vGrBUdNZoW1KFbdAHCdGYJeuIGMavNGt6VvOsNewU0HiaXHiavEVlwda6FIX3icW7YSJFYjOEzZw/132";
};

Canvas.prototype.undo = function () {
	var that = this;

	// that.boardLocalIdList.pop();
};
/**
 *  清除画板
 */
Canvas.prototype.clear = function () {
	var that = this;
	that.ctx.clearRect(0, 0, that.width,that.height);
	that.dataQueue = [];
};

/***********anyRTC***********/
Canvas.prototype.strokeBoard = function (BData) {
	var that = this;

	that.clear();
	if (BData.length !== 0) {
		for (var i=0; i<BData.length; i++) {
			// 存储画笔数据
			that.boardData.push(BData);

			let data, strBData = BData[i].board_data;

			if (typeof strBData === "string") {
				data = JSON.parse(strBData);
			} else if (typeof strBData === "object") {
				data = strBData;
			}

			that[that.returnStrType(data.DType)](data);
		}
		// 添加等待队列画完的图片
		that.dataQueue.push(that.ctx.getImageData(0, 0, that.width, that.height));
		if (that.doneQueue.length !== 0) {
			that.doneQueue = [];
		}
	}
};

export default Canvas;


// WEBPACK FOOTER //
// ./src/assets/board/newdraw.js