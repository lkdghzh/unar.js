/**
 * one vm prop <---> one Hub
 */
var id = 0;
export default class Hub{
    constructor(cb){
        this.id=++id;
        this.listeners=[]
        this.addListener(cb)
    }
    addListener(cb){
        this.listeners.push(cb)
    }
    deleteListener(){
        
    }
}