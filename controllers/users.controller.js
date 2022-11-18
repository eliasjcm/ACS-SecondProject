import RedisClient from "../index.js";
import neo4jController from "./neo.controller.js";
import bcrypt from "bcrypt";

export default class UsersController {
  static async addUser(req, res) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const fullName = req.body.fullName;
      const birthDate = req.body.birthDate;
      const avatar = req.body.avatar;


      RedisClient.exists(username, (err, result) => {
        let user = result === 1;
        if (user) {
          res.status(500).json({ err });
          return;
        } else {

          neo4jController.createUser({ username: username , avatar: avatar});

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              RedisClient.hset(
                username,
                "username",
                username,
                "password",
                hash,
                "fullName",
                fullName,
                "birthDate",
                birthDate,
                "avatar",
                avatar,
                (err, response) => {
                  if (err) throw err;

                  res.json({
                    username: username,
                    password: hash,
                    fullName: fullName,
                    birthDate: birthDate,
                    avatar: avatar
                  });
                }
              );
            });
          });
        }
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async editUser(req, res) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const fullName = req.body.fullName;
      const birthDate = req.body.birthDate;
      const avatar = req.body.avatar;

      neo4jController.editUser({ username: username , avatar: avatar});
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          RedisClient.hset(
            username,
            "password",
            hash,
            "fullName",
            fullName,
            "birthDate",
            birthDate,
            "avatar",
            avatar,
            (err, response) => {
              if (err) throw err;

            }
          );
        });
      });

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getUser(req, res) {
    try {
      let username = req.params.username;

      RedisClient.hgetall(username, (err, response) => {
        if (err) throw err;

        if (res !== null) {
          res.json(response);
        }
      });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }

  static async getUsers(req, res) {
    try {
      let usernames = await neo4jController.findAllUser({username: req.params.username})
      var results = new Array();
      
      usernames.forEach(async (user) => {
        RedisClient.hgetall(
          user.name, (err, result) => {
            if (result) {
              if(user.relation === 'YES') {
                result = {...result, friend: true}
              } else if (user.relation === 'NO') {
                result = {...result, friend: false}
              }
              results.push(result);
            } else {
              results.push(result);
            }
            if (results.length == usernames.length) {
              res.json(results.filter(item => !!item));
            }
          }
        )
      })
    } catch (e) {
      res.status(500).json(req, res)
    }
  }

  static async authUser(req, res) {
    try {
      const { username, password } = req.body;

      RedisClient.hget(username, "password", (err1, response) => {
        if (err1 || response === null) {
          res.status(400).json({ err1 });
          return;
        }

        bcrypt.compare(password, response, (err2, result) => {
          if (err2) {
            res.status(401).json({ err2 });
            return;
          }
          
          if (result) {
            RedisClient.hgetall(username, (err3, user) => {
              if (err3) {
                res.status(402).json({ err3 });
                return;
              }

              res.json(user);
            });
          } else {
            res.status(503).json({ error: "Contraseña no es igual" });
          }
        });
      });
    } catch (e) {
      res.status(504).json({ error: e });
    }
  }
}
