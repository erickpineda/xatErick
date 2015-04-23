module.exports = function(http) {
    var usuaris = {};  //usuaris contindrà tots els usuaris connectats al xat
    console.log('holaasa');
    var io = require("socket.io")(http);  //sockect.io necessita http per funcionar
    
    io.on('connection', function(socket) {
        console.log('conn');
        
        socket.on('disconnect', function(){
            /*
                Quan es disconnecta un usuari
                del xat, l'esborrem de la 
                variable usuaris i avisem
                a la resta d'usuaris del xat
            */
            delete usuaris[socket.id];
            io.emit('message', usuaris[socket.io] + ' ha marxat');
            
        });
        
        socket.on('newUser', function(user) {
            /* Quan s'incorpora un nou usuari al xat
                l'afegim a la variable usuaris
                i enviem un missatge a la resta 
                d'usuaris avisam que hi ha un nou
                usuari
            */
            console.log('asdñlafj');
            usuaris[socket.id] = user;
            socket.emit('newUser','ok');
            
            io.sockets.emit('message',user +" s'ha afegit al xat");
            
        });
        
        socket.on('message', function(msg) {
            console.log(msg);
            // Quan un usuari envia un missatge l'enviem a la resta de usuaris en el xat
            io.emit('message', msg);
        });
      
    });
};
