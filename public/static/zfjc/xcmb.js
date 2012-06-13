function initToggle(){
	var legends = document.getElementsByTagName('legend');
	for(var i=0,len=legends.length;i<len;i++){
		legends[i].onclick = function(){
			for(var j=0,ln=this.parentElement.childNodes.length;j<ln;j++){
				var nodeName = this.parentElement.childNodes[j].nodeName;
				if(nodeName&&nodeName.toUpperCase() === 'TABLE'){//兼容浏览器,有的浏览器childNodes的个数不同
					var tbl = this.parentElement.childNodes[j];
					if(tbl.style.display === 'none'){
						tbl.style.display = 'block';
						this.childNodes[0].className= 't-tool t-tool-toggle';
					}else {
						tbl.style.display = 'none';
						this.childNodes[0].className= 't-tool t-tool-toggle2';
					}
				}
			}
		}
	}

	/**
	 * 初始化折叠起
	 * @type Number
	 */
	for(var i=2,len=legends.length;i<len;i++){//init
		for(var j=0,ln=legends[i].parentElement.childNodes.length;j<ln;j++){
			var nodeName = legends[i].parentElement.childNodes[j].nodeName;
			if(nodeName&&nodeName.toUpperCase() === 'TABLE'){//兼容浏览器,有的浏览器childNodes的个数不同
				var tbl = legends[i].parentElement.childNodes[j];
				tbl.style.display = 'none';
				legends[i].childNodes[0].className= 't-tool t-tool-toggle2';
			}
		}
	}			
}