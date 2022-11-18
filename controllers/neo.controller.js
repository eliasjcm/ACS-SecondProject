import neo4j from "neo4j-driver"
import dotenv from "dotenv"

dotenv.config()

//const driver = neo4j.driver(process.env.NEO_URI, neo4j.auth.basic(process.env.NEO_USERNAME, process.env.NEO_PASSWORD));
const driver = neo4j.driver("neo4j+s://fddcaad9.databases.neo4j.io:7687", neo4j.auth.basic("neo4j", "L8dtaQGMiwNXYlU4YzUdWHCdOkcIhfGa6pMWFis0u64"));

export default class neo4jController {
    //Retorna todos los nodos COURSE de  neo4j
    static findAllJoinedCourse = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`Match (u:COURSE) 
                                            WHERE (:USER {name: '${data}'})-[:REGISTERED]->(u)
                                            return u`)
            return result.records.map(i => i.get('u').properties)
        } catch (e) { console.log(`Error: findCourseCreated => ${e}`) }
        session.close();
    }

    static findAllNotJoinedCourses = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`Match (u:COURSE) 
                                            WHERE NOT (:USER {name: '${data}'})-[:REGISTERED]->(u) 
                                            AND 
                                            NOT (:USER{name: '${data}'})-[:TEACH]->(u) 
                                            return u`)
            return result.records.map(i => i.get('u').properties)
        } catch (e) { console.log(`Error: findCourseCreated => ${e}`) }
        session.close();
    }

    //10. Como docente debo poder ver la lista de todos los cursos que he creado, cuáles están activos y cuáles ya están terminados.
    static findCourseCreated = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (list:COURSE)<-[:TEACH]-(:USER{name: '${data}'})
                                            RETURN list`)
            return result.records.map(i => i.get('list').properties)

        } catch (e) { console.log(`Error: findCourseCreated => ${e}`) }
        session.close();
    }

    //8.Como docentes debo poder ver la lista de estudiantes matriculados a un curso.
    //19.Como estudiante debo poder ver la lista de los otros estudiantes que están llevando el curso.
    static findStudentsByClass = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (:COURSE {name: '${data}'})<-[:REGISTERED]-(list:USER)
                                            RETURN list`)
            return result.records.map(i => i.get('list').properties)

        } catch (e) { console.log(`Error: findStudentsByClass => ${e}`) }
        session.close();
    }

    //14.Como estudiante debo poder ver la lista de cursos a los que estoy matriculado.
    static findCourseListStudent = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (r:COURSE)<-[:REGISTERED]-(:USER {name: '${data}'}) RETURN r`)
            return result.records.map(i => i.get('r').properties)
        } catch (e) { console.log(`Error: findCourseListStudent => ${e}`) }
        session.close();
    }

    /*20.Como usuario puedo hacerme amigo de otro usuario, en cuyo caso puedo ver cuáles cursos ha 
    llevado y en cuales es docente, pero no puedo ver la nota de ninguno.*/
    //Hace amigos a 2 usuarios
    static makeFriends = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (c1:USER {name: '${data.myID}'})
                                            MATCH (c2:USER {name: '${data.userID}'})
                                            MERGE (c1)-[r:FRIENDS]->(c2)
                                            RETURN type(r) AS relation`)
        } catch (e) { console.log(`Error: makeFriends => ${e}`) }
        session.close();
    }

    //Lista de cursos de un amigo/usuario
    static findListCourseFriends = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`RETURN "Docente en:" AS Cursos
                                            UNION
                                            MATCH (:USER {name : '${data.userID}'})-[:TEACH]->(list1:COURSE)
                                            RETURN list1.name  AS Cursos
                                            UNION
                                            RETURN "==================" AS Cursos
                                            UNION
                                            RETURN "Estudiante en:" AS Cursos
                                            UNION
                                            MATCH (:USER {name : '${data.userID}'})-[:REGISTERED]->(list1:COURSE)
                                            RETURN list1.name AS Cursos`)
            return result.records.map(i => i.get('Cursos'))

        } catch (e) { console.log(`Error: findClassmates => ${e}`) }
        session.close();
    }

    //Retorna todos los nodos USER de  neo4j
    static findAllUser = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`Match (r:USER)
                                            Where not r.name = '${data.username}'
                                            OPTIONAL MATCH (r)-[e:FRIENDS]-(:USER {name:'${data.username}'})
                                            RETURN {                            
                                                name : r.name,                                                                                
                                                relation : CASE type(e) WHEN NULL THEN 'NO' ELSE 'YES' END                                     
                                            } as usersList`)
            return result.records.map(i => i.get('usersList'))
        } catch (e) { console.log(`Error: findAllUser => ${e}`) }
        session.close();
    }

    //Crear usuario
    static createUser = async (data) => {
        const session = driver.session();
    
        try {
            const result = await session.run(`MERGE (r:USER {name: '${data.username}',avatar:'${data.avatar}'})RETURN r`)
        } catch (e) { console.log(`Error: createUser => ${e}`) }
        session.close();
    }
  //Editar usuario
    static editUser = async (data) => {
        const session = driver.session();
    
        try {
            const result = await session.run(`MATCH (r:USER {name: '${data.username}'})SET r.avatar='${data.avatar}'`)
        } catch (e) { console.log(`Error: editUser => ${e}`) }
        session.close();
    }



    //Crear curso que un profesor va a enseñar
    static createCourse = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (t:USER {name:'${data.teacherID}'})
                                            MERGE (t)-[r:TEACH]->(:COURSE{name:'${data.courseID}'})`)
        } catch (e) { console.log(`Error: createCourse => ${e}`) }
        session.close();
    }

    //Crear tema de un curso
    static createTopic = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (t:COURSE {name:'${data.courseID}'})
                                            CREATE (t)-[:HAS]->(r:TOPIC{name:'${data.topicID}'})`)
        } catch (e) { console.log(`Error: createTopic => ${e}`) }
        session.close();
    }

    //Crear subtema de un curso
    static createSubtopic = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (:COURSE {name:'${data.courseID}'})-[:HAS]-(t:TOPIC {name:'${data.topicID}'})
                                            CREATE (t)-[:HAS]->(r:SUBTOPIC{name:'${data.subtopicID}',contents: []})`)
        } catch (e) { console.log(`Error: createSubtopic => ${e}`) }
        session.close();
    }

     //Añadir contenido al subtema de un curso
     static addContentToSubtopic = async (data) => {
        const session = driver.session();
        console.log(data)
        try {
            const result = await session.run(`MATCH (:COURSE {name:'${data.courseID}'})-[:HAS]-(:TOPIC {name:'${data.topicID}'})-[:HAS]-(r:SUBTOPIC {name:'${data.subtopicID}'})
                                            SET r.contents = r.contents + ['${data.contents}']`)
        } catch (e) { console.log(`Error: addContentToSubtopic => ${e}`) }
        session.close();
    }



    //Retornar temas y subtemas de un curso
    static findTopicsCourse = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (c:COURSE {name: '${data}'})-[:HAS]->(r)
            WITH r as topic
            OPTIONAL MATCH (topic)-[:HAS]->(e)
            with topic, COLLECT(e{id: e.name, contents: CASE WHEN e.contents IS NULL THEN null ELSE e.contents END })  as subT
            RETURN {idTopic : topic.name, subTopics : CASE WHEN subT IS NULL THEN [] ELSE subT END} as Topics`)

            return result.records.map(i => i.get('Topics'))

        } catch (e) { console.log(`Error: findTopicsCourse => ${e}`) }
        session.close();
    }

    //registrar usuario en un curso como estudiante
    static registerStudent = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (s:USER {name:'${data.studentID}'})
                                            MATCH (c:COURSE{name:'${data.courseID}'})
                                            MERGE (s)-[r:REGISTERED]->(c)
                                            RETURN r`)
        } catch (e) { console.log(`Error: registerStudent => ${e}`) }
        session.close();
    }

    //Verifica si 2 usuarios son amigos
    static verifyFriends = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`OPTIONAL MATCH (:USER {name:'${data.userID1}'})-[:FRIENDS]-(b:USER {name:'${data.userID2}'})
            RETURN CASE b WHEN NULL THEN false ELSE true END AS FRIENDS`);
            return result.records.map(i => i.get('FRIENDS'))
        } catch (e) {
            console.log(`Error: verifyFriends => ${e}`)
        }
        session.close();
    }

    //Verifica si un usuario es docente de un curso
    static findTeacherCourse = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (r:USER)-[:TEACH]->(:COURSE {name:'${data}'})
                                            RETURN r.name AS teacherID`);
            return result.records.map(i => i.get('teacherID'))
        } catch (e) {
            console.log(`Error: verifyTeacherCourse => ${e}`)
        }
        session.close();
    }

    //Verifica si un usuario es estudiante de un curso
    static verifyStudentCourse = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`OPTIONAL MATCH (:USER {name:'${data.studentID}'})-[:REGISTERED]->(b:COURSE {name:'${data.courseID}'})
            RETURN CASE b WHEN NULL THEN 'NO' ELSE 'YES' END AS COURSE`);
            return result.records.map(i => i.get('COURSE'))
        } catch (e) {
            console.log(`Error: verifyStudentCourse => ${e}`)
        }
        session.close();
    }

    //Clonar temas y subtemas de un curso
    static cloneCourse = async (data) => {
        const session = driver.session();
        try {
            const result = await session.run(`MATCH (rootA:COURSE{name:'${data.courseID1}'}), (rootB:COURSE{name:'${data.courseID2}'})
                                            MATCH path = (rootA)-[:HAS*]->(node)
                                            WITH rootA, rootB, collect(path) as paths
                                            CALL apoc.refactor.cloneSubgraphFromPaths(paths, {
                                                standinNodes:[[rootA, rootB]]
                                            })
                                            YIELD input, output, error
                                            RETURN input, output, error`)
        } catch (e) {
            console.log(`Error: cloneCourse => ${e}`)
        }
        session.close();

    }
}