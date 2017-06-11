var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');    //html压缩
var minifyCss = require('gulp-minify-css');    //css压缩
var uglify = require('gulp-uglify');//js的压缩
var concat = require('gulp-concat');//文件合并
var imagemin = require('gulp-imagemin');//图片的压缩
var sass = require('gulp-sass');//sass编译
var webserver = require('gulp-webserver');//web服务热启动
var browserify = require('gulp-browserify');//模块化的打包
var url = require('url');
var data = require('./data/data.js'); // 引入mock数据
var rev = require('gulp-rev'); // 对文件名加MD5后缀 加密
var revCollector = require('gulp-rev-collector'); // 路径替换

gulp.task('minhtml',function(){
	gulp.src('src/*.html')
	    .pipe(htmlmin({collapseWhitespace: true}))
	    .pipe(gulp.dest('build/'))
})

gulp.task('mincss',function(){
	gulp.src('src/*.css')
	    .pipe(minifyCss())
	    .pipe(gulp.dest('build/'))
})

gulp.task('minjs',function(){
	gulp.src('src/*.js')
	    .pipe(concat('concat.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest('build/'))
})

gulp.task('minimg',function(){
	gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
})

gulp.task('minsass',function(){
	gulp.src('src/*.scss')	    
	    .pipe(sass())
	    .pipe(gulp.dest('build/'))
})

gulp.task('server', ['minhtml','mincss','minjs'],function() {
	gulp.watch('src/*.html',['minhtml'])
	gulp.watch('src/*.css',['mincss'])
	gulp.watch('src/*.js',['minjs'])
	
	gulp.src('./build')
		.pipe(webserver({
		  livereload: true,  // 实时刷新
		  directoryListing: true, // 打开默认端口,自动显示文件夹在页面中(以目录的形式)  为false时不能显示
		  // webserver启mock数据接口,基于webserver的中间件middleware
		  // 经过这一层读取静态文件
		  middleware:function(req,res,next){
		  		//console.log(req.url)
		  		//console.log(url.parse(req.url).pathname)
		  		var pathName = url.parse(req.url).pathname;
		  		data.forEach(function(i){
		  			switch(i.route){
		  				case pathName:{
		  					i.handle(req,res,next,url)
		  				}
		  				break;
		  			}
		  		})
		  },
		  //open: '/index.html' // 默认打开某个页面,true或以字符串的方式可以具体去指定
		}))
})

gulp.task('scripts', function() {
    gulp.src('src/js/*.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./build/js'))
})

gulp.task('revs',function(){
	gulp.src('src/css/*.css')	    
	    .pipe(rev())
	    .pipe(gulp.dest('./build/css'))
	    .pipe(rev.manifest()) // 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/js')); // 存放rev-manifest.json的路径
})

gulp.task('replaceRev', ['revs'], function () {
    gulp.src(['rev/js/*.json', './src/html/*.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': '/build/css',              
                'cdn/': function(manifest_value) {
                    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                }
            }
        }) ) // 执行文件内css名的替换
        .pipe( gulp.dest('./build/html') ) // 替换后文件输出的目录
});