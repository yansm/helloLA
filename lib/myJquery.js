$(function (){
	/* 卷屏速度 */
	var scrollSpeed = 1000;
	/* 初始化标记 */
	var startFlag = 'welcome';
	/* 背景壁纸管理 */
	var $img = $('.wallpaper_img');  //桌面壁纸
	$img.each(function () {
		var $this = $(this);
		$this.width($(window).width());
		$this.height($(window).height());
		$this.css({
				'margin-top' : '-' + $this.height()/2 + 'px',
				'margin-left' : '-' + $this.width()/2 + 'px'
		});
		$this.load(function () {
			$this.css({
				'margin-top' : '-' + $this.height()/2 + 'px',
				'margin-left' : '-' + $this.width()/2 + 'px'
			});
		});
	});
	
	
	/* 左侧菜单经过 点击事件 */
	var $mainNavList = $('.main_navList');
	$mainNavList.find('img').each(function () {
		var $this = $(this);
		$this.mouseenter(function () {
			if(!$this.hasClass('current'))
				toSmall($mainNavList.find('.current'));
			toBig($this);
		}).mouseleave(function () {
			if(!$this.hasClass('current')){
				toSmall($this);		
			}
		}).click(function () {
			addFlag($this);
		});
	});
	$mainNavList.mouseleave(function (){
		toBig($mainNavList.find('.current'));
	});
	/* 滚动事件 */
	var scrollEvent = function() {
		$('.main_box').each(function () {
			var $this = $(this)
				,height = $this.offset().top
				,windowHeight = $(window).scrollTop()
				,absHeight = height - windowHeight;
				if(absHeight >= 0&&absHeight < 200){
					var itemFlag = $this.attr('id').replace('_box','')
						,item = $('#'+itemFlag+'_icon');
					if(!item.hasClass('current'))
						clickIcon(item);
				};
		});
	};
	/* 左侧菜单变化事件 */
	var toBig = function (_this) {     //图标变大事件
		var iconSrc = './images/' + _this.attr('data-icon') + 'H.png';
		_this.animate({height:'110px'},'fast').attr('src',iconSrc);
	} 
	var toSmall = function (_this) {    //图标变小事件
		var iconSrc = './images/' + _this.attr('data-icon') + '.png';
		_this.animate({height:'60px'},'fast').attr('src',iconSrc);	
	}
	
	/* 左侧菜单与右侧联动 */
	var addFlag = function (_this) {
		var itemFlag = _this.attr('id').replace('_icon','')
			,height = 	$('#' + itemFlag + '_box').offset().top;
		if($(window).scrollTop() == height - 70) return;
		$(window).unbind('scroll');
		$('body,html').animate({scrollTop:height-70},scrollSpeed);
		if(!_this.hasClass('current'))clickIcon(_this);
		setTimeout(function () {
			$(window).unbind('scroll').bind('scroll',function () {
				scrollEvent();
			});
		},scrollSpeed);

	}
	/* 左侧菜单点击事件 */
	var clickIcon = function (_this) {
		var itemFlag = _this.attr('id').replace('_icon','')
			,$current = $mainNavList.find('img.current');
		$current.removeClass('current');  //找到之前的点击图标 吐掉标记位 缩小
		toSmall($current);
		
		_this.addClass('current'); //增加改标记位 增大
		toBig(_this);
		$('.wallpaper').fadeOut('slow');  //隐藏所有背景
		$('#' + itemFlag + '_wp').fadeIn('slow'); //显示当前背景
	};
	/* 右侧菜单事件 */
	var navList = $('.navList');
	navList.find('a').each(function () {
		var $this = $(this)
			,contentArea = $this.find('.content_area');
		if(contentArea.length <= 0)return;
		$this.hover(function () {
			$this.css('width','auto');
			contentArea.show();
		} ,function () {
			$this.css('width','100%');
			contentArea.hide();
		});
	});
	/* shopping 相册动画 */
	var $shoppingLi = $('#shopping_box').find('li.shopping_li');
	$shoppingLi.each(function () {
		var $this = $(this),
			$picTitle = $this.find('div.pic_title'),
			$picDesc = $this.find('div.pic_desc');
		$this.on({
			mouseenter : function () {
				$picTitle.hide();
				$picDesc.show();
			},
			mouseleave : function () {
				$picTitle.show();
				$picDesc.hide();
			}
		});
	});
	
	/* 初始化事件 */
	var main = function () {
		$(window).bind('scroll',function () {
			scrollEvent();
		});
		clickIcon($('#'+ startFlag +'_icon'));
		/*按钮初始化 */
		$('#arrow_rcion').click(function () {
			addFlag($('#'+ startFlag +'_icon'));
		});
		$('.losMap').find('a').each(function () {
			var $this = $(this),dataFlag = $this.attr('data-flag');
			$this.click(function () {
				$('.losMap').find('a').removeClass('current');
				$this.addClass('current');
				$('#gwBoxPhoto').toPage({'num' :dataFlag});
			});
		});
	};
	main();
});

/* 相框 */
(function ($,window,undefined) {
	$.fn.buildPhotos = function (settings) {
		/* 初始化数据 */
		var creatPhotos = function (elem) {
			var imgMap = settings.imgMap
				,photoWidth = settings.photoWidth
				,photoHeight = settings.photoHeight
				,displayNum = settings.displayNum
				,animateStyle = settings.animateStyle
				,photoCount = imgMap.length
				,automatic = settings.automatic
				,hasDescription = settings.hasDescription
				,hasArrow = settings.hasArrow
				,animateSpeed = settings.animateSpeed
				,clickExEvent = settings.clickExEvent ||$.noop
				,paddingRight = settings.paddingRight
				,paddingBottom = settings.paddingBottom;
			var html = [];
			html.push('<div class="photo_box rel" style="width:'+ photoWidth +'px;height:'+ (hasDescription?photoHeight + 90:photoHeight) +'px;"><div class="photo_area"><div class="photo_item"><ul class="rel fix">');
			$.each(imgMap,function (i,node) {
				html.push( '<li data-index="'+ i +'" ><div class="img_box rel"><img src="'+ node.imgUrl +'"></div>');
				if(hasDescription){
					html.push( '<div class="description">'+ node.description +'</div>');
				}
				html.push( '</li>');
			} );
			html.push( '</ul></div></div>');
			if(hasArrow) html.push('<a class="prev"></a><a class="next"></a>');
			html.push( '</div>');
			html.push( '<div class="photo_toolbar">');
			for ( var i = 0;i < photoCount;i++){
				html.push( '<a data-index="'+ i +'"  class="'+ (i==0?'current':'') +'"></a>');
			}
			html.push( '</div>');
			
			elem.html(html.join(" "));
			
			/* 样式调整 */
			if(!settings.hasToolbar) elem.find('.photo_toolbar').hide();
			elem.find('li').css({'width':(photoWidth)/displayNum + 'px','height':(photoHeight) + 'px','padding-right':paddingRight,'padding-bottom':paddingBottom});
			elem.find('.img_box').css({'width':'100%','height':'100%'});
			elem.find('img').css({'width':'100%','height':'100%'});
			elem.find('.next').css('top',(photoHeight/2 - 39) + 'px');
			elem.find('.prev').css('top',(photoHeight/2 - 39) + 'px');
			elem.find('.photo_item').css('width',(photoWidth/displayNum) *(Number(photoCount)  + 1 )+ 'px');
			
			/* fade方式展现 */
			var animateFade = function () {
				var lis = elem.find('li');
				lis.css({
					'position' : 'absolute',
					'left' : '0px',
					'right' : '0px',
					'display' : 'none'
				});
				lis.eq(0).fadeIn();
				
			}
			/* move方式展现 */
			var animateMove = function () {
				var ul = elem.find('ul'),li = ul.find('li[data-index="0"]').clone();
				li.attr('data-index',photoCount)
				ul.css({
					'position' : 'absolute',
					'left' : '0',
					'top' : '0'
				}).append(li);
				ul.find('li').css({
					'float' : 'left'
				});
			}
			var animateMap = {
				'fade' : animateFade,
				'move' : animateMove
			};
			
			/* fade 点击事件 */
			var clickFade = function (index) {
				elem.find('li').fadeOut(animateSpeed);
				elem.find('li[data-index="'+ index +'"]').fadeIn(animateSpeed);
			};
			/* move 点击事件 */
			var clickMove = function (index,flag) {
				var $ul = elem.find('ul')
					leftNum = index * photoWidth/displayNum;
				if(flag == 0 - photoCount + 1){
					leftNum = photoCount * photoWidth/displayNum;
					$ul.animate({
						'left' : '-' + leftNum + 'px'
					},animateSpeed).animate({
						'left' : '0px'
					},0);
					return;
				}
				if(flag == photoCount -1){
					$ul.animate({
						'left' : '-'  + photoCount * photoWidth/displayNum + 'px'
					},0).animate({
						'left' : '-' + leftNum + 'px'
					},animateSpeed);
					return;
				}
				
				$ul.animate({
					'left' : '-' + leftNum + 'px'
				},animateSpeed);
			};
			var clickMap = {
				'fade' : clickFade,
				'move' : clickMove
			};
			
			var changeClick = function (flag) {
				var index = elem.find('.photo_toolbar .current').attr('data-index');
				if(flag>0)
					var index = Number(index) + Number(flag) >= photoCount?0:Number(index) + Number(flag);
				if(flag<0)
					var index = Number(index) + Number(flag) < 0?photoCount-1:Number(index) + Number(flag);
				elem.find('.photo_toolbar a[data-index="'+ index +'"]').click();
				clickExEvent(index);
			}
			/* 工具栏动态 */
			var toolbarBaseFn = function () {
				elem.find('.photo_toolbar a').each(function () {
					var $this = $(this);
					$this.click(function () {
						if($this.hasClass('current'))return;
						var index = $this.attr('data-index'), lastIndex = elem.find('.photo_toolbar .current').attr('data-index');
						elem.find('.photo_toolbar a').removeClass('current');
						$this.addClass('current'); 
						clickMap[animateStyle](index,index - lastIndex);
					})
				});
			}
			/* 选择展现方式 */
			var animateFn = animateMap[animateStyle];
			animateFn();
			/* 工具栏动态 */
			toolbarBaseFn();
			/* 左右剪头动态 */
			elem.find('.next').click(function () {
				changeClick(1);			
			});
			elem.find('.prev').click(function () {
				changeClick(-1);
			});
			/* 是否自动播放 */
			var intervalFn = function () {
				changeClick(1)
			}	
;			if(automatic > 0){
				setInterval(intervalFn, automatic)
			}
		}
		
		settings = $.extend({}, $.fn.buildPhotos.defaults, settings);
	
		return this.each(function () {
			var $this = $(this);
			creatPhotos($this);
		});
	};
	/* 默认数据 */
	$.fn.buildPhotos.defaults = {
		photoWidth : 516,
		photoHeight : 346,
		hasToolbar : true,
		hasArrow : true,
		hasDescription : false,
		hasTitle : false,
		hasFlag : false,
		animateStyle : 'fade',
		displayNum : 1,
		automatic :  5000,
		paddingBottom : 0,
		paddingRight : 0,
		animateSpeed : 500
	}; 
	/* 外部接口 */
	$.fn.toPage = function (opts){
		var elem = this
			,num = opts.num;
		elem.find('.photo_toolbar a[data-index="'+ num +'"]').click();
	}
}) (jQuery,this);

/* 数据初始化 */
$(function (){
	var imgMap = [
		{ 
			imgUrl : './images/photos/011.jpg'
		},
		{ 
			imgUrl : './images/photos/012.jpg'
		},
		{ 
			imgUrl : './images/photos/013.jpg'
		}
	];
	$('#mainBoxPhoto').buildPhotos({
		imgMap : imgMap,
		hasArrow : false
	});
	
	var imgMap2 = [
		{ 
			imgUrl : './images/photos/001.jpg',
			description : '圣莫妮卡广场（Santa Monica Place）临近海滩，这里汇集了洛杉矶高档购物商店、餐厅及休闲场所，是游客们购物休闲的好去处。'
		},
		{ 
			imgUrl : './images/photos/002.jpg',
			description : '圣莫妮卡港（Santa Monica Pier）景色怡人，还有一座名为“太平洋公园”（Pacific Park）的游乐园，是家庭游客人的首选目的地之一。'
		},
		{ 
			imgUrl : './images/photos/003.jpg',
			description : '第三购物步行街(Third Street Promenade)是游客休闲的好去处，这里聚集了各种各样的路边歌手、艺术家，还有电影院、商店和餐厅为游客提供休闲服务。'
		},
		{ 
			imgUrl : './images/photos/004.jpg',
			description : '好莱坞环球影城独一无二的精彩体验将为您和您的家人带来无限欢畅感受！'
		},
		{ 
			imgUrl : './images/photos/005.jpg',
			description : '好莱坞环球影城汇集众多刺激有趣的娱乐设施，环球影城将给您充满精彩与刺激的一天。'
		},
		{ 
			imgUrl : './images/photos/006.jpg',
			description : '环球城市大道是集娱乐，餐饮，购物为一体的大型娱乐场所。如果您想在洛杉矶体验一段充满惊喜刺激的旅程，那么环球城市大道绝对是您的首选之地。'
		},
		{ 
			imgUrl : './images/photos/007.jpg',
			description : '这里聚集了世界闻名、最受公众欢迎的国际顶级大师的设计作品。'
		},
		{ 
			imgUrl : './images/photos/008.jpg',
			description : '罗迪欧大道坐落在比弗利山庄的罗迪欧大道，是洛杉矶市最高档、最精美的服饰商业街。'
		},
		{ 
			imgUrl : './images/photos/009.jpg',
			description : '华特迪士尼音乐厅 (Walt Disney Concert Hall) 的建筑师把功能和美学完美的结合在一起，让建筑上升成为作品，名垂青史。'
		},
		{ 
			imgUrl : './images/photos/010.jpg',
			description : '华特迪士尼音乐厅 (Walt Disney Concert Hall) 是这个城市跳动的音符。'
		},
		{ 
			imgUrl : './images/photos/011.jpg',
			description : '华特迪士尼音乐厅 (Walt Disney Concert Hall) 将各种美学柔和在一起，体现着缔造者的气质。'
		},
		{ 
			imgUrl : './images/photos/012.jpg',
			description : '迈克尔杰克逊于1984年在好莱坞星光大道上留下手印。'
		},
		{ 
			imgUrl : './images/photos/013.jpg',
			description : '好莱坞星光大道 (Hollywood Walk of Fame) 建于1958年，是条沿美国好莱坞大道与藤街伸展的人行道，上面有2000多颗镶有好莱坞名人姓名的星形奖章。'
		},
		{ 
			imgUrl : './images/photos/014.jpg',
			description : '活力洛城体育娱乐中心(L.A. LIVE)包括六条街区及一个大型公共广场，这里拥有15家电影院、饭店、夜总会、商店、ESPN的西海岸广播总部、格莱美博物馆以及一家在洛杉矶展览中心，还有斯台普斯中心及其旁边拥有1,100间客房的饭店。'
		},
		{ 
			imgUrl : './images/photos/015.jpg',
			description : '诺基亚剧院从2007年开始运营，是Anschutz Entertainment Group位于活力洛城的一部分，毗邻着斯台普斯中心。从2008年起，九月二十一号在ABC电视台播出的艾美奖颁奖典礼从圣殿礼堂搬到了诺基亚剧院。'
		},
		{ 
			imgUrl : './images/photos/016.jpg',
			description : '活力洛城体育娱乐中心(L.A. LIVE)位于洛杉矶的市中心，是集饭店、餐饮、购物和娱乐为一体的综合娱乐性区域，包括一个大型的公共广场、15家电影院、饭店、夜总会、商店、ESPN的西海岸广播总部、格莱美音乐(奖)博物馆、斯台普斯球馆等。'
		}
		
	];
	var clickEx = function (index) {
		var a = $('.losMap').find('a[data-flag="'+ index +'"]');
		if(a.length>0) a.click();
	};
	$('#gwBoxPhoto').buildPhotos({
		imgMap : imgMap2,
		photoWidth : 581,
		photoHeight : 394,
		hasDescription : true,
		hasToolbar : false,
		automatic : 0,
		animateStyle : 'move',
		clickExEvent : clickEx
	});
	
	var imgMap3 = [
		{ 
			imgUrl : './images/experence/001.jpg'
		},
		{ 
			imgUrl : './images/experence/002.jpg'
		},
		{ 
			imgUrl : './images/experence/003.jpg'
		},
		{ 
			imgUrl : './images/experence/004.jpg'
		},
		{ 
			imgUrl : './images/experence/005.jpg'
		},
		{ 
			imgUrl : './images/experence/006.jpg'
		}
	];
	$('#experenceBox').buildPhotos({
		imgMap : imgMap3,
		photoWidth : 760,
		photoHeight : 232,
		paddingRight : 30,
		displayNum : 2,
		animateStyle : 'move',
		hasArrow : false
	});
});
	
