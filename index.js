import express from 'express';
import path from 'path';
//import fs from 'fs/promises';
import fs from 'fs';
import JavaScriptObfuscator from 'javascript-obfuscator';
import inquirer from 'inquirer';
const app = express();
const port = 3000



async function Asking() {
  let questions = [{
    name: "tryagain",
    type: "confirm",
    message: "Do you want to RUN again?",
  }]
  const inputs = await inquirer.prompt(questions);
  if(inputs.tryagain===true){
    listDir()
  }
}
async function listDir() {
  try {
    let folders = [
      "",
      "",
    ]
    //await Promise.all()
    folders.map(async (folder)=>{
      fs.readdir(folder, (err, files) => {
        if(err) {return console.log(err)}
        files.forEach(file => {
          let fileFullPath = folder+'/'+file
          let stats = fs.statSync(fileFullPath)
          if(stats.isFile()){
            if (path.extname(file) === ".js"){
              if(file.indexOf('.min')<0)
              {
                fs.readFile(fileFullPath, "UTF-8", function(err, data){
                  if(err) {return console.log(err)}
                  var obfuscationResult = JavaScriptObfuscator.obfuscate(data,
                  {
                    target: 'browser',
                    seed: 0,
                    selfDefending: true,
                    stringArray: true,
                    stringArrayRotate: true,
                    stringArrayShuffle: true,
                    stringArrayThreshold: 0.75,
                    stringArrayIndexShift: true,
                    stringArrayIndexesType: ['hexadecimal-number'],
                    stringArrayWrappersCount: 2,
                    stringArrayWrappersType: 'function',
                    stringArrayWrappersParametersMaxCount: 4,
                    stringArrayWrappersChainedCalls: true,
                    stringArrayEncoding: ['base64'],
                    splitStrings: true,
                    identifierNamesGenerator: 'hexadecimal',
                    compact: true,
                    simplify: true,
                    transformObjectKeys: true,
                    numbersToExpressions: true,
                    controlFlowFlattening: true,
                    controlFlowFlatteningThreshold: 0.75,
                    deadCodeInjection: true,
                    deadCodeInjectionThreshold: 0.4,
                  });
                                      
                  //Write the obfuscated code into a new file
                  let fileName = file.split('.')[0]
                  let newFile = fileName+'.min.js'
                  fs.writeFile(folder+'/'+newFile, obfuscationResult.getObfuscatedCode() , function(err) {
                    if(err) {return console.log(err)}
                    console.log(newFile+" was saved!");
                  });
                });
              }
            }
          }
        })
      })
    })
    setTimeout(()=>Asking(),10000)
  } catch (err) {
    console.log(err);
  }
}
listDir();

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})