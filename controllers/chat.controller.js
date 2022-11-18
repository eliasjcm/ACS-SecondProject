import RedisClient from "../index.js"

export default class ChatController {

    static async createPrivateRoom(req, res) {
        try {
            const username1 = req.body.username1
            const username2 = req.body.username2

            RedisClient.SADD(
                `${username1}:rooms`, `${username1}:${username2}`
            )

            RedisClient.SADD(
                `${username2}:rooms`, `${username1}:${username2}`
            )

            res.json({status: "success"})

        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async sendPrivateMessage(req, res) {
        try {
            const username1 = req.body.username1
            const username2 = req.body.username2
            const sender = req.body.sender
            const date = new Date()
            const avatar = req.body.avatar;
            const day = date.getUTCDate()
            const month = date.getUTCMonth() + 1
            const year = date.getUTCFullYear()
            const msg = req.body.msg
            const score = new Date().getTime();
            const newDate = day + "/" + month + "/" + year
            const obj = {
                "from": sender,
                "date": newDate,
                "msg": msg,
                "score": score,
                "avatar": avatar
            }

            RedisClient.smembers(
                `${username1}:rooms`,
                (err, response) => {
                    if (err) throw err

                    if (response.includes(`${username1}:${username2}`)) {
                        RedisClient.ZADD(
                            `room:${username1}:${username2}`, 'NX', score,
                            (JSON.stringify(obj))
                        )
                    } else if (response.includes(`${username2}:${username1}`)) {
                        RedisClient.ZADD(
                            `room:${username2}:${username1}`, 'NX', score,
                            (JSON.stringify(obj))
                        )
                    } else {
                        RedisClient.SADD(`${username1}:rooms`, `${username1}:${username2}`)
                        RedisClient.SADD(`${username2}:rooms`, `${username1}:${username2}`)

                        RedisClient.ZADD(
                            `room:${username1}:${username2}`, 'NX', score,
                            (JSON.stringify(obj))
                        )
                    }
                }
            )
            res.json(obj)
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async prueba(req, res) {
        try {

            const username1 = req.body.username1

            RedisClient.smembers(
                `${username1}:rooms`,
                (err, response) => {
                    if (err) throw err

                    res.json(response)
                }
            )
            
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async getPrivateMessages(req, res) {
        try {
            const username1 = req.params.user1
            const username2 = req.params.user2
            let prueba = []

            RedisClient.smembers(
                `${username1}:rooms`,
                (e, result) => {
                    if (e) throw e
                    
                    if (result.includes(`${username1}:${username2}`)) {
                        RedisClient.ZRANGE(
                            `room:${username1}:${username2}`, 0, -1,
                            (err, response) => {
                                if (err) throw err

                                for (let i = 0; i < response.length; i++) {
                                    prueba.push(JSON.parse(response[i]))
                                }

                                res.json(prueba)
                            }
                        )
                    } else if (result.includes(`${username2}:${username1}`)) {
                        RedisClient.ZRANGE(
                            `room:${username2}:${username1}`, 0, -1,
                            (err, response) => {
                                if (err) throw err

                                for (let i = 0; i < response.length; i++) {
                                    prueba.push(JSON.parse(response[i]))
                                }

                                res.json(prueba)
                            }
                        )
                    } else {
                        res.json([])
                    }
                }
            )
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}