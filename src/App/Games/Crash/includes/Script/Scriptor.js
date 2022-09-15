import {__} from "../../../../../Helper";

/*
 * Parse , Edit , Delete Object
 * By Pedram
*/
class Scriptor {
    constructor() {
        this.scripts = [];
    }
    
    get(){
        return this.scripts;
    }
    
    add(data) {
        this.scripts.push(data);
        this.scripts = __.flattenDeep(this.scripts)
    }
    
    edit(data){
        var index = __.findIndex(this.scripts, function(o) { return o.name == data.name; });
        if (index > -1) {
            this.scripts[index].content = data.content;
        }
    }
    
    delete(name){
        var index = __.findIndex(this.scripts, function(o) { return o.name == name; });
        if (index > -1) {
          this.scripts.splice(index, 1);
        }
    }
}

export default Scriptor;