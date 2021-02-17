const express = require("express");


const router = express.Router();

const Sites = require("./models/geodata")

const validator = require("./validators")
const passport = require("passport");
const  bcrypt = require("bcrypt");
const User = require("./models/users");


checkAuthenticated= (req, res, next) =>{
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.logout();
        if (req.session){
            req.session.destroy(function (error) {
                if (error) {
                    console.log(error)
                }
                return res.render("login");

            })
        }else {
            res.render("login");
        }


    }
}



router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/login", async (req, res) => {
    res.render("login", {error: req.flash("error")})
});

router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy(function (error) {
        res.redirect("/login");

    })

})

router.post("/user", async (req, res) => {
  try {
      let {username, password} = req.body;
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      let user = new User({username, password});
      await user.save();
      res.json({
          status:0,
          reason:"success"
      })

  }catch (error){
      console.log(error);
      res.json({
          status:1,
          reason:"System Error"
      })
  }

})


router.get("/",checkAuthenticated, async (req, res) => {
    res.render("index")

});


router.get("/site_data", checkAuthenticated, async (req, res) => {
    await getData(res)

})

router.post("/save",checkAuthenticated, async (req, res) => {
    try {
        const {error} = validator.validateRequest(req.body);
        const {site_id, site_status,site_name, lat, long } = req.body
        if (error){
            return res.json({
                status:2,
                reason:error.message
            })
        }
        let db_site = await Sites.findOne({site_id});
        if (db_site){
            db_site.name = site_name;
            db_site.site_id=site_id;
            db_site.status=site_status;
            db_site.location.coordinates=[parseFloat(long), parseFloat(lat)];
            await db_site.save();

        }else {
            return res.json({
                status:1,
                reason:"Site ID is invalid."
            })

        }

        await getData(res)

    }catch (error){
        console.log(error);
        res.json({
            status:1,
            reason:"System Error.Please contact SysAdmin"
        })


    }

})



router.post("/add", checkAuthenticated,async (req, res) => {
    console.log(req.body);
    try {
        const {error} = validator.validateRequest(req.body);
        const {site_id, site_status,site_name, lat, long } = req.body
        if (error){
            return res.json({
                status:2,
                reason:error.message
            })
        }

        let site = new Sites({
            name:site_name,
            site_id,
            status:site_status,
            location:{
                coordinates:[parseFloat(long), parseFloat(lat)],
                type:"Point"
            }
        });

        await site.save();
        await getData(res)

    }catch (error){
        console.log(error);
        res.json({
            status:1,
            reason:"System Error.Please contact SysAdmin"
        })
    }

})

router.post("/delete", checkAuthenticated,async (req, res) => {
    console.log(req.body);
    try {
        const {error} = validator.validateDeleteRequest(req.body);
        const {site_id } = req.body
        if (error){
            return res.json({
                status:2,
                reason:error.message
            })
        }
        await Sites.deleteOne({site_id})
        await getData(res)

    }catch (error){
        console.log(error);
        res.json({
            status:1,
            reason:"System Error.Please contact SysAdmin"
        })
    }

})




async function getData(res) {
    const db_result = await Sites.find({},["site_id", "name","status","location"]);
    const final_result =[];
    for (const data of db_result) {
        let temp={};
        temp.site_id = data.site_id;
        temp.site_name=data.name;
        temp.status=data.status;
        temp.loc_latitude = data.location. coordinates[1];
        temp.loc_longitude=data.location.coordinates[0];
        final_result.push(temp);
    }
     return res.json({
         status:0,
         reason:"success",
         dataSet:final_result
     })

}








module.exports = router;
