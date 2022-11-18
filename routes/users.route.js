import express from 'express'
import UsersController from "../controllers/users.controller.js"
import neo4jController from '../controllers/neo.controller.js'
import ChatController from '../controllers/chat.controller.js'
import CoursesController from '../controllers/courses.controller.js'

const router = express.Router();

router.route("/prueba").get(ChatController.prueba)

router.route("/register").post(UsersController.addUser)
router.route("/login").post(UsersController.authUser)

router.route('/getUserInfo/:username').get(UsersController.getUser)
router.route("/getUsers/:username").get(UsersController.getUsers)
router.route('/editUser').post(UsersController.editUser)

router.route("/privateRoom").post(ChatController.createPrivateRoom)
router.route("/sendPrivateMSG").post(ChatController.sendPrivateMessage)
router.route("/getPrivateMSG/:user1/:user2").get(ChatController.getPrivateMessages)

router.route("/addCourse").post(CoursesController.addCourse)
router.route("/getCourse/:courseId").get(CoursesController.getCourse)
router.route("/getOwnCourses/:username").get(CoursesController.getOwnCourses)
router.route("/getJoinedCourses/:username").get(CoursesController.getJoinedCourses)
router.route("/getNotJoinedCourses/:username").get(CoursesController.getNotJoinedCourses)


//Retorna todos los nodos de  neo4j
router.get('/NeoAllUser/:idUser', async (req, res) => {
    const result = await neo4jController.findAllUser(req.params.idUser)
    res.json(result)
})

//Retorna todos los nodos de  neo4j
router.get('/NeoAllJoinedCourse/:idUser', async (req, res) => {
    const result = await neo4jController.findAllJoinedCourse(req.params.idUser)
    res.json(result)
})

router.get('/NeoAllNotJoinedCourses/:idUser', async (req, res) => {
    const result = await neo4jController.findAllNotJoinedCourses(req.params.idUser)
    res.json(result)
})

//19.Como estudiante debo poder ver la lista de los otros estudiantes que están llevando el curso.
//8.Como docentes debo poder ver la lista de estudiantes matriculados a un curso.
router.get('/NeofindStudentList/:idUser', async (req, res) => {
    const result = await neo4jController.findStudentsByClass(req.params.idUser) //courseID
    res.json(result)
})

//14.Como estudiante debo poder ver la lista de cursos a los que estoy matriculado.
router.post('/NeofindCourseListStudent/:idUser', async (req, res) => {
    const result = await neo4jController.findCourseListStudent(req.params.idUser) //name
    res.json(result)
})

//10. Como docente debo poder ver la lista de todos los cursos que he creado, cuáles están activos y cuáles ya están terminados.
router.get('/NeofindCourseCreated/:idUser', async (req, res) => {
    const result = await neo4jController.findCourseCreated(req.params.idUser) //name
    res.json(result)
})

/*20.Como usuario puedo hacerme amigo de otro usuario, en cuyo caso puedo ver cuáles cursos ha 
llevado y en cuales es docente, pero no puedo ver la nota de ninguno.*/
//Hace amigos a 2 usuarios
router.post('/NeomakeFriends', async (req, res) => {
    const result = await neo4jController.makeFriends(req.body)//myID, userID
    res.json(result)
})

//Lista de cursos de un amigo/usuario
router.post('/NeofindListCourseFriends', async (req, res) => {
    const result = await neo4jController.findListCourseFriends(req.body)//userID
    res.json(result)
})

//Crear usuario
router.post('/NeocreateUser', async (req, res) => {
    const result = await neo4jController.createUser(req.body)//name
    res.json(result)
})

//Editar usuario
router.put('/NeoeditUser', async (req, res) => {
    const result = await neo4jController.editUser(req.body)//name
    res.json(result)
})



//Crear curso que un profesor va a enseñar
router.post('/NeocreateCourse', async (req, res) => {
    const result = await neo4jController.createCourse(req.body)//teacherID, courseID
    res.json(result)
})

//Crear tema de un curso
router.post('/NeocreateTopic', async (req, res) => {
    const result = await neo4jController.createTopic(req.body)//courseID, topicID
    res.json(result)
})

//Crear subtema de un tema
router.post('/NeocreateSubTopic', async (req, res) => {
    const result = await neo4jController.createSubtopic(req.body)//topicID, subtopicID
    res.json(result)
})

//Retornar temas y subtemas de un curso
router.get('/NeofindTopicsCourse/:courseID', async (req, res) => {
    const result = await neo4jController.findTopicsCourse(req.params.courseID)//courseID
    res.json(result)
})

//registrar usuario en un curso como estudiante
router.post('/NeoregisterStudent', async (req, res) => {
    const result = await neo4jController.registerStudent(req.body)//studentID, courseID
    res.json(result)
})

//Verifica si 2 usuarios son amigos
router.get('/NeoverifyFriends', async (req, res) => {
    const result = await neo4jController.verifyFriends(req.body)//userID1, userID2
    res.json(result)
})

//Verifica si un usuario es docente de un curso
router.get('/NeoFindteacherCourse/:idCourse', async (req, res) => {
    const result = await neo4jController.findTeacherCourse(req.params.idCourse)
    res.json(result)
})

//Clonar temas y subtemas de un curso
//IMPORTANTE: SE AL CLONAR UN CURSO, ANTES SE DEBE USAR <</NeocreateCourse>> PARA PRIMERO CREAR EL CURSO
// A DONDE SE DESEA GUARDAR LO CLONADO
router.post('/NeoCloneCourse', async (req, res) => {
    const result = await neo4jController.cloneCourse(req.body)//courseID1, courseID2
    res.json(result)
})

router.put('/NeoAddContent', async (req, res) => {
    const result = await neo4jController.addContentToSubtopic(req.body)
    res.json(result)
})




export default router
