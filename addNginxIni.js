const fs = require('fs');

function AddNginxIni(config, uris, feedback){
    this.config = config;
    this.uris = uris;
    this.feedback = feedback;
}

AddNginxIni.prototype.apply = function(compiler) {
    const self = this;
    compiler.plugin("after-emit", function(compilation, callback) {
        self.write();
        callback();
    });
};

AddNginxIni.prototype.write = function(){
    let content = '';

    for(let key in this.uris){
        if(this.uris.hasOwnProperty(key)){
            if(key.indexOf(' ') !== -1){
                console.error('Path "'+key+'": Packet blank space is not allowed!');
                return;
            }
            let file = this.uris[key];
            if(key.substr(-1) === '/'){
                if(file.indexOf(key) === 1){
                    content += key + ' *\n';
                }else{
                    console.error('Path "'+key+'" is not match "'+file+'", Should be prefixed with "'+key+'"');
                    return;
                }
            }else if(file !== this.feedback){
                content += key + ' ' + file + this.config.htmlSuffix + "\n";
            }
        }
    }

    try{
        fs.writeFileSync(this.config.path.dist + "/nginx.ini", content);
    }catch(err){
        return console.log(err);
    }
    console.log("The nginx.ini created!");
};

module.exports = AddNginxIni;