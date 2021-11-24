import express from 'express';
import path from 'path';
import fs from 'fs';
import JavaScriptObfuscator from 'javascript-obfuscator';
import inquirer from 'inquirer';
const app = express();
const port = 3000

const obfuscatorEncrypt = (data) => {
  let dataEncrypted = JavaScriptObfuscator.obfuscate(data,
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
  return dataEncrypted.getObfuscatedCode()
}
const EncrypFiles = () =>{
  console.log("-----------------------------------------------");
  // INSERT YOUR FOLDER(S)
  // The format of path is > c:/users/users1/documents/project1/assets/js (DO not use back slash \)
  let folders = [
    'C:/Users/kleyt/Desktop/www/fastsniperbot/app',
    'C:/Users/kleyt/Desktop/www/fastsniperbot/app/database',
  ]
  let filenames
  let fileContent
  let fileExtention = '.js'
  let filesExcludesOfSearch = [
    '.min.js', //exclude files min
  ]
  folders.map(async (folder)=>{
      console.log("FOLDER> "+folder);
      filenames = fs.readdirSync(folder);
      for(let file of filenames){
        let fileFullPath = folder+'/'+file
        let stats = fs.statSync(fileFullPath)
        if(stats.isFile()){
          if (path.extname(file) === fileExtention){
            if(!file.includes(filesExcludesOfSearch))
            {
              fileContent = fs.readFileSync(folder+'/'+file, {encoding:'utf8', flag:'r'})
              let fileContentEncrypted = obfuscatorEncrypt(fileContent)
              //Write the obfuscated code into a new file
              let fileName = file.split('.')[0]
              let newFile = fileName+'.min'+fileExtention
              try {
                fs.writeFileSync(folder+'/'+newFile, fileContentEncrypted, {encoding: "utf8"})
                console.log('\t'+newFile+" was encrypted!");
              } catch(err) {
                console.error(err);
              }
            }
          }
        }
      }
  })
  console.log("-----------------------------------------------");
  console.log('All Done!')
  console.log("\n");
  run()
}
async function Asking() {
  let questions = [{
    name: "tryagain",
    type: "confirm",
    message: "Do you want to Encrypt files?",
  }]
  const inputs = await inquirer.prompt(questions);
  if(inputs.tryagain===true){
    EncrypFiles()
  }else{
    run()
  }
}
async function run() {
  Asking()
}
run()
//#####################################################################################
//#####################################################################################
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
// app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))