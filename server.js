const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    fs = require("fs");

const app = express();

let users = [];
let idSetter = 1;

app.use(express.static(path.join(__dirname, '/views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use("/.css$/", path.join(__dirname, "views/styles"))

app.get("/", (req, res) => {
    res.redirect("/create")
});

app.get("/create", (req, res) => {
    res.render("create");
});

app.post("/create", (req, res) => {
    fs.readFile("data.json", "UTF-8", (err, data) => {
        if (err) {}
        else {
            users = JSON.parse(data);
            if (users.length > 0) {
                idSetter = users[users.length - 1].id + 1;
            }
            else {
                idSetter = 1;
            }
            users.push({id: idSetter, user: req.body});
            idSetter++;
            let json = JSON.stringify(users);
            fs.writeFile("data.json", json, "UTF-8", (err) => {
                if (err) console.log(err);
                console.log("Changes Saved");
            });
            res.redirect("/list");
        }
    });
});

app.get("/list", (req, res) => {
    fs.readFile("data.json", "UTF-8", (err, data) => {
        if (err) {}
        else {
            users = JSON.parse(data);
            res.render("list", {
                list: users
            });
        }
    });
});

app.get("/edit/:id", (req, res) => {
    fs.readFile("data.json", "UTF-8", (err, data) => {
        if (err) {}
        else {
            users = JSON.parse(data);
            let user = userById(req.params.id);
            res.render("edit", {
                user: user,
                id: req.params.id
            });
        }
    });
});

app.post("/edit/:id", (req, res) => {
    fs.readFile("data.json", "UTF-8", (err, data) => {
       if (err){}
       else {
           users = JSON.parse(data);
           setUserById(req.params.id, req.body);
           let json = JSON.stringify(users);
           fs.writeFile("data.json", json, "UTF-8", (err) => {
               if (err) console.log(err);
               console.log("Changes Saved");
           });
           res.redirect("/list");
       }
    });
});

app.get("/delete/:id", (req, res) => {
    fs.readFile("data.json", "UTF-8", (err, data) => {
        if (err){}
        else {
            users = JSON.parse(data);
            deleteUser(req.params.id);
            let json = JSON.stringify(users);
            fs.writeFile("data.json", json, "UTF-8", (err) => {
                if (err) console.log(err);
                console.log("Changes Saved");
            });
            res.redirect("/list");
        }
    });
});

app.listen(3000);

console.log("Listening on port 3000.");

function userById(id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == Number(id)) {
            console.log("done")
            return users[i].user;
        }
    }
    return null;
}

function setUserById(id, body) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == Number(id)) {
            console.log("Meow");
            users[i].user = body;
            break;
        }
    }
}

function deleteUser(id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            users.splice(i, 1);
        }
    }
}