/**
 * one vm prop <---> one Hub
 */
var id = 0;
export default class Hub{
    constructor(prop,cb){
        this.id=++id;
        this.prop=prop;
        this.listeners=[]
        this.addListener(cb)
    }
    addListener(cb){
        this.listeners.push(cb)
    }
    deleteListener(){
        
    }
    notify(){
        this.listeners.forEach((fn)=>{
            fn()
        })
    }
}