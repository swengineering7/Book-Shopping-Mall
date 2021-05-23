const local = require("./localStrategy");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id); //  user.id가 session(req.session.passport.user)에 저장됨
  });

  // 메모리에 한번만 저장
  passport.deserializeUser((id, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값
    done(null, id); // req.user에 idr값 저장
  });

  local(passport);
};