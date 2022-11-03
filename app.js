const http = require('http')
const fs = require('fs')
const server = http.createServer((req,res)=>{
    const url = req.url
    const method = req.method

    if(url === '/'){
        
        fs.readFile('message.txt','utf8',(err,data)=>{
            if(err){
                console.log(err)
            }
            res.write('<html>')
            res.write('<title>Node Server</title>')
            res.write(`<body>${data}</body>`)
            res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">send</button></form></body>')
            res.write('</html>')
            return res.end()
        })
    }

    else if(url==='/message' && method === 'POST'){ 
        const body = [] 
        req.on('data',(chunk)=>{
            body.push(chunk)
        })
        
        return req.on('end',()=>{
            let parsedBody = Buffer.concat(body).toString()
            parsedBody = parsedBody.split('=')[1]

            fs.writeFile('message.txt',parsedBody,err=>{
                if(err){
                    console.log(err)
                }
                res.statusCode = 302
                res.setHeader('Location','/')
                return res.end() 
            })           
        })
       
    }else{
        res.setHeader('content-type','text/html')
        res.write('<html>')
        res.write('<title>Default page</title>')
        res.write('<body><h1>Node default page</h1></body>')
        res.write('</html>')
        res.end()}

    
})

server.listen(3000)