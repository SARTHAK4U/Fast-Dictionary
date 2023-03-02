const csv = require('csv-parser')
const fs = require('fs')

const results=[]

fs.createReadStream('word-meaning-examples.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push(data)
    })
    .on('end', () => {
        console.log("Data Fed to the trie")
        fs.writeFileSync('data.json',JSON.stringify(results))
    })

