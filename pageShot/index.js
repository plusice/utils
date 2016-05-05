function pageShot(callback) {
	var startX,startY,endX,endY;
	var maskCanvas = document.createElement('canvas');
	var maskCtx = maskCanvas.getContext('2d');
	var body = document.body,
    	html = document.documentElement;
	var width = Math.max( body.scrollWidth, body.offsetWidth, 
	                       html.clientWidth, html.scrollWidth, html.offsetWidth );
	var height = Math.max( body.scrollHeight, body.offsetHeight, 
	                       html.clientHeight, html.scrollHeight, html.offsetHeight );

	maskCanvas.style.position = 'absolute';
	maskCanvas.style.left = 0;
	maskCanvas.style.top = 0;
	maskCanvas.width = width;
	maskCanvas.height = height;

	maskCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
	maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
	document.getElementsByTagName('body')[0].appendChild(maskCanvas);

	maskCanvas.addEventListener('mousedown', downListener);
	maskCanvas.addEventListener('mouseup', upListener);

	function downListener(e) {
		startX = e.pageX;
		startY = e.pageY;
		maskCanvas.addEventListener('mousemove', moveListener);
	}

	function moveListener(e) {
		maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
		maskCtx.globalCompositeOperation = 'source-over';
		maskCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
		maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

		maskCtx.globalCompositeOperation = 'destination-out';
		maskCtx.fillStyle = "#fff";
		maskCtx.fillRect(startX,startY,e.pageX-startX,e.pageY-startY);
	}

	function upListener(e) {
		endX = e.pageX;
		endY = e.pageY;
		maskCanvas.removeEventListener('mousedown', downListener);
		maskCanvas.removeEventListener('mousemove', moveListener);
		maskCanvas.removeEventListener('mouseup', upListener);
		html2canvas(document.body, {
			onrendered: function(canvas) {
				var shotCanvas = document.createElement('canvas')
				var shotCxt = shotCanvas.getContext("2d");
				shotCanvas.width = Math.abs(endX - startX);
				shotCanvas.height = Math.abs(endY - startY);
				shotCxt.drawImage(
					canvas,
					startX < endX ? startX : endX,
					startY < endY ? startY : endY,
					shotCanvas.width,
					shotCanvas.height,
					0,
					0,
					shotCanvas.width,
					shotCanvas.height
				);
				var base64 = shotCanvas.toDataURL('image/png', 1.0);
				maskCanvas.parentNode.removeChild(maskCanvas)
				callback(base64);
			}
		});
	}
}