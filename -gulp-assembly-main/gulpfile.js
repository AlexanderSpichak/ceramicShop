const { src, dest, watch, parallel } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const plumber = require('gulp-plumber');
const gcmq = require('gulp-group-css-media-queries');
const purgecss = require('@fullhuman/postcss-purgecss');

//------------- Компиляция Sass -> css и обновление браузера
function styles() {
    let plugins = [
        autoprefixer({ overrideBrowserslist: ['last 8 version'], grid: true }),
        purgecss({ content: ['app/*.html'], safelist: [/slick/, /button$/, /mfp/] }), // Очистка от неиспользуемых css правил (Очиста от мусора)
    ]
    return src('app/scss/style.scss')
        .pipe(scss()) //scss -> css(outputStyle - минификатор css), expanded - обычный css.
        .pipe(postcss(plugins))// Подключаем плагины для post css
        .pipe(concat('style.min.css')) //style.scss -> style.min.css(переименовывает)
        .pipe(gcmq())   //Оптимизация медиазапросов
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css')) //Создание директории css в директории app
        .pipe(browserSync.reload({ stream: true }));;//(External: http://192.168.1.30:3000 ссылка для других устройств внутри сети)
}

//Оптимизация всего кода js
function scripts() {
    return src([
        'app/js/main.js'//Сюда пишется путь для дополнительных файлов js, фраемворков и т.п. через запятую
    ])
        .pipe(concat('main.min.js')) //Обьединяет все указанные файлы
        .pipe(uglify())//Минимизирует код js
        .pipe(dest('app/js'))////Создание директории js в директории app
        .pipe(browserSync.stream());//Обновление данных без обновления страницы сайта
}

//Указываем директорию создаваемого сервера
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}
//Оптимизация изображений.
const images = function () {
    return src('app/images/**/*')
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        // .pipe(webp()) - Конвертация в WebP.
        .pipe(dest('dist/images'))
}
function watching() {
    watch(['app/scss/**/*.scss'], styles); //Автоматическая компиляция Sass -> css
    watch(['app/*.html']).on('change', browserSync.reload); //Обновление страницы при изменении HTML
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)//Автоматическое обновление main.min.js
}
//
function build() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/fonts/**/*',
        'app/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.build = build
exports.default = parallel(watching, browsersync, images, scripts, styles);
exports.golife = build



//Запуск билда - "gulp on"
