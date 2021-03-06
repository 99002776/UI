const {Pool} = require("pg")
const express = require ("express")
const app = express();
app.use(express.json())
app.use(express.static("images")); 
const pool = new Pool({
    "user": "postgres",
    "password" : "password",
    "host" : "localhost",
    "port" : 5432,
    "database" : "Boat"
})

 
app.get("/", (req, res) => res.sendFile(`${__dirname}/main.html`))
app.get("/display", (req, res) => res.sendFile(`${__dirname}/index.html`))



app.get("/todos", async (req, res) => {
    const rows =await readTodos();
    // res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
})    


 
app.post("/todos", async (req, res) => {   
    let result = {}
    try{
        const reqJson = req.body;
        result.success = await createTodo(reqJson.todo)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
   
})




 
app.delete("/todos", async (req, res) => {
    let result = {}
    try{
 
        const reqJson = req.body;
        result.success = await deleteTodo(reqJson.id)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
   
})
 
app.listen(8080, () => console.log("Web server is listening.. on port 8080"))
 
start()
 
async function start() {
    await connect();
    /*
    const todos = await readTodos();
    console.log(todos)
    const successCreate = await createTodo("Go to trader joes")
    console.log(`Creating was ${successCreate}`)
    const successDelete = await deleteTodo(1)
    console.log(`Deleting was ${successDelete}`)
    */
}
 
async function connect() {
    try {
        await pool.connect(); 
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}
 
async function readTodos() {
    try {
       
    const results = await pool.query("SELECT boatlocation.hin,boatlocation.latitude,boatlocation.longitude,boatlocation.heading,boatdynamics.engid,boatdynamics.engine_revolutions,boatdynamics.engine_temperature,boatdynamics.fuel_rate,boatdynamics.timestamp FROM boatlocation INNER JOIN boatdynamics ON boatdynamics.timestamp = boatlocation.timestamp ");
    return results.rows;
    }
    catch(e){
        return [];
    }
}
 
async function createTodo(todoText){
 
    try {
        await pool.query("insert into todos (text) values ($1)", [todoText]);
        return true
        }
        catch(e){
            return false;
        }
}


 
async function deleteTodo(id){
 
    try {
        await pool.query("delete from todos where id = $1", [id]);
        return true
        }
        catch(e){
            return false;
        }
}