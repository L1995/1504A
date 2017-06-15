var Mock = require('mockjs');  // 使用 Mock

module.exports = [
	{
		route:"/api/index",
		handle:function(req,res,next,url){
			var data = {
		  			name:'1504A'
		  		}
		  	res.writeHead(200,{
		  		"Content-type":"application/json;charset=UTF-8",
		  		"Access-Control-Allow-Origin":"*" //允许所有主机进行请求,允许跨域,基于http协议,可为*或写固定ip
		  	})
		  	res.write(JSON.stringify(data));
		  	res.end();
		}
	},
	{
		route:"/api/index1",
		handle:function(req,res,next,url){
			var data = [
				{
		  			name:'one'
		  		},
		  		{
		  			name:'two'
		  		}
			]
		  	res.writeHead(200,{
		  		"Content-type":"application/json;charset=UTF-8",
		  		"Access-Control-Allow-Origin":"*" //允许所有主机进行请求,允许跨域,基于http协议,可为*或写固定ip
		  	})
		  	res.write(JSON.stringify(data));
		  	res.end();
		}
	},
	{
		route:"/api/index2",
		handle:function(req,res,next,url){
			var data = Mock.mock({
			    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
			    'list|1-10': [{
			        // 属性 id 是一个自增数，起始值为 1，每次增 1
			        'id|+1': 1
			    }]
			})
		  	res.writeHead(200,{
		  		"Content-type":"application/json;charset=UTF-8",
		  		"Access-Control-Allow-Origin":"*" //允许所有主机进行请求,允许跨域,基于http协议,可为*或写固定ip
		  	})
		  	res.write(JSON.stringify(data));
		  	res.end();
		}
	},
	{
		route:"/api/index3",
		handle:function(req,res,next,url){
			var Random = Mock.Random;
			Random.extend({
			    constellation: function(date) {
			        var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
			        return this.pick(constellations)
			    }
			})
			var data = Random.constellation();
			//var data = Random.color();
		  	res.writeHead(200,{
		  		"Content-type":"application/json;charset=UTF-8",
		  		"Access-Control-Allow-Origin":"*" //允许所有主机进行请求,允许跨域,基于http协议,可为*或写固定ip
		  	})
		  	res.write(JSON.stringify(data));
		  	res.end();
		}
	},
	{
		route:"/api/index4",
		handle:function(req,res,next,url){
			var Random = Mock.Random;
			Random.integer();
			Random.string('lower',4);
			Random.date('yyyy-MM-dd');
			var data = Mock.mock({
				"menuList|6":[{
					'menuNav':'@string("lower",4)',
					'menuNavContent|1-5':[{
						'url':'index.html',
						'name':"@string('lower',4)",
						'id':'@integer(0,10)'
					}]
				}]
			})
		  	res.writeHead(200,{
		  		"Content-type":"application/json;charset=UTF-8",
		  		"Access-Control-Allow-Origin":"*"
		  	})
		  	res.write(JSON.stringify(data));
		  	res.end();
		}
	}
]