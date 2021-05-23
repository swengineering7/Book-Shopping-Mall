const localStrategy = require("passport-local").Strategy;

module.exports = passport => {
  passport.use(
    new localStrategy(
      {
        usernameField: "id",
        passwordField: "pw",
        passReqToCallback: true
      },
      
      (id, pw, done) => {
        var user = {
          id: "kw",
          pw: "1234"
        };

        if(id != "kw" || pw != "1234"){
          console.log('비밀번호 불일치!')
          return done(null, false, req.flash('loginMessage', '비밀번호 불일치!'))
        }
   
        console.log('비밀번호 일치!')
        return done(null, {
          userId : userId,
          password: password
        })

      }
    )
  );
};