const gulp = require("gulp");
//convert sass into css
const sass = require("gulp-sass");
//compress the file into nano
const cssnano = require("gulp-cssnano");
//rename the file in one line
const rev = require("gulp-rev");

const del = require("del");
//used to minify images
const imagemin = require("gulp-imagemin");
//used to minify js
const uglify = require("gulp-uglify-es").default;

gulp.task("css", function (done) {
  console.log("minify css");
  gulp
    .src("./assets/sass/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets.css"));

  gulp
    .src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

gulp.task("js", function (done) {
  console.log("minify js");

  gulp
    .src("./assets/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

gulp.task("images", function (done) {
  console.log("minfying images...");
  gulp
    .src("./assets/**/*.+(png|jpg|gif|svg|jpeg)")
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
  done();
});

//empty the public assets directory
gulp.task("clean:assets", function (done) {
  del.sync("./public/assets");
  done();
});

//it will run all four of above function mergely
gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images"),
  function (done) {
    console.log("Building assets");
    done();
  }
);
