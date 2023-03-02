class FCFS {
    constructor(size) {
        this.maxsize = size
        this.cache = new Map()
    }
    insert(key, value) {
        if(this.cache.size>=this.maxsize){
            this.removeFirst()
        }
        this.cache.set(key, value)
    }
    search(key) {
        return this.cache.get(key)
    }
    removeFirst() {
        this.cache.delete(this.cache.keys().next().value)
    }
    size(){
        return this.cache.size
    }
}

module.exports = FCFS