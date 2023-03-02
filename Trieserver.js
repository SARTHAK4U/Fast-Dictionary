const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const FcfsCache = require('./util/fcfsCache')
const Trie = require('./util/Trie')

const Cache = new FcfsCache(1)

app.use(express.json())
app.use(express.static('public'))


// instantiate our trie
var trie = new Trie();

const data = fs.readFileSync("util/data.json")
const obj = JSON.parse(data)

obj.forEach(element => {
    trie.insert(element.Word, element.Meaning, element['Examples/0'], element['Examples/1'])
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/search', function (req, res) {
    var startTime = Date.now();

    let searchWord = req.body.word
    searchWord = searchWord.toLowerCase()

    console.log("Word Searched = " + searchWord);
    let result;
    /*
        Using FCFS Cache
    */
    result = Cache.search(searchWord)
    if (!result) {
        console.log('Cache Miss');
        const resultArr = trie.meaning(searchWord)
        // console.log(resultArr);
        if (resultArr[0]!=null) {
            result = {
                meaning: resultArr[0],
                usage_1: resultArr[1],
                usage_2: resultArr[2]
            }
        }
        else {
            result = {
                error: 'word not found'
            }
        }
        Cache.insert(searchWord, result)
    }
    else {
        console.log('Cache Hit');
    }
    res.send(result)
    var endTime = Date.now();
    console.log(`Execution time: ${endTime - startTime} ms\n`);
})

app.get('/autofill', function (req, res) {
    const searchWord = req.body.word
    console.log(searchWord);
    suggestions = trie.find(searchWord)
    console.log(suggestions);
    res.send({
        suggestions: suggestions
    })
})

app.listen(3000, () => {
    console.log(`Listening at http://localhost:3000\n`);
})