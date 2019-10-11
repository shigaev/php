//Подключаем галп
const gulp = require('gulp');
//Объединение файлов
const concat = require('gulp-concat');
//Добапвление префиксов
const autoprefixer = require('gulp-autoprefixer');
//Оптисизация стилей
const cleanCSS = require('gulp-clean-css');
//Оптимизация скриптов
const uglify = require('gulp-uglify');
//Удаление файлов
const del = require('del');
//Синхронизация с браузером
const browserSync = require('browser-sync').create();
//Для препроцессоров стилей
const sourcemaps = require('gulp-sourcemaps');
//Sass препроцессор
const sass = require('gulp-sass');
//Сжатие фото
const imagemin = require('gulp-imagemin');
//Rename
const rename = require('gulp-rename');
//Сжатие html файлов
// const htmlmin = require('gulp-htmlmin');
//Порядок подключения файлов со стилями
const styleFiles = [
    './src/css/header.scss',
    './src/css/main.scss',
    './src/css/footer.scss',
    './src/css/media.scss',
];
//Порядок подключения js файлов
const scriptFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];

//Таск для обработки стилей
gulp.task('styles', () => {
    //Шаблон для поиска файлов CSS
    //Всей файлы по шаблону './src/css/**/*.css'
    return gulp.src(styleFiles)
        .pipe(sourcemaps.init())
        //Указать stylus() , sass() или less()
        .pipe(sass())
        //Объединение файлов в один
        .pipe(concat('style.css'))
        //Добавить префиксы
        .pipe(autoprefixer('last 2 versions'))
        //Минификация CSS
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(rename({
            suffix: '.min'
        }))
        //Выходная папка для стилей
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
});

//Сжатие html
// gulp.task('minify', () => {
//     return gulp.src('*.html')
//         .pipe(htmlmin({ collapseWhitespace: true }))
//         .pipe(gulp.dest('./'));
// });

//Таск для обработки скриптов
gulp.task('scripts', () => {
    //Шаблон для поиска файлов JS
    //Всей файлы по шаблону './src/js/**/*.js'
    return gulp.src(scriptFiles)
        //Объединение файлов в один
        .pipe(concat('script.js'))
        //Минификация JS
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        //Выходная папка для скриптов
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());
});

//Таск для очистки папки build
gulp.task('del', () => {
    return del(['build/*'])
});

//Таск компресси изображений
gulp.task('img-compress', () => {
    return gulp.src('./src/img/**')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./build/img/'))
});

//Таск для отслеживания изменений в файлах
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Отслеживание изображений
    gulp.watch('./src/img/**', gulp.series('img-compress'));
    //Следить за файлами со стилями с нужным расширением
    gulp.watch('./src/css/**/*.scss', gulp.series('styles'));
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', gulp.series('scripts'));
    //При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
});

//Таск по умолчанию, Запускает del, styles, scripts и watch
gulp.task('default', gulp.series('del', gulp.parallel('styles', /*'minify',*/ 'scripts', 'img-compress'), 'watch'));