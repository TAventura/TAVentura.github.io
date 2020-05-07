var audio = new Audio('sounds/Victory.mp3');
let turno = ""; //pondremos aca la referencia al objeto que representa al jugador que le toca jugar.
//audio.play(); //good music

class Jugador {
    constructor(nombre, marca) {
        this.nombreJugador = nombre;
        this.marca = marca; //con marca me refiero a si tiene un circulo o cruz (o evenvtualmente otro simbolo)
        this.elementosMarcados = new Array(0, 0, 0); //acá vamos a almacenar los divs que seleccionó
        this.ultimoMarcado = -1;
    }

    //ponemos los setter y getter.... no, setter no.
    getNombre() {
        return this.nombreJugador;
    }
    getMarca() { //marca hace referencia a la imagen que le pondremos.
        return this.marca;
    }
    getOponente() {
        return this.oponente;
    }

    setOponente(oponente) {
        this.oponente = oponente; //oponente va a ser la referencia al otro objeto jugador
    }
}

function empezar() {
    //console.log(nombre1);
    let nombre1 = document.getElementById("input1").value;
    let nombre2 = document.getElementById("input2").value;
    
    document.getElementById("nombres").style.display = "none";
    document.getElementById("tablero").style.display = "flex";

    let jugador1 = new Jugador(nombre1, "images/close.png");
    let jugador2 = new Jugador(nombre2, "images/ui.png"); //este va a ser el circulo.

    jugador1.setOponente(jugador2);
    jugador2.setOponente(jugador1); //seteamos como opontente del jugador 1 al jug2 y viceversa.
    
    //ahora seteamos el turno a Jugador 1 ya que es el primero en jugar.
    turno = jugador1;
}

function marcar(id) { //el div nos pasa por parámetro su propio id
    let div = document.getElementById(id); //div representa un cuadradito, en realidad son buttons
    //div.disabled=false;
    if (div.disabled === false) { //si el div está activado, que marque, si no, no
        //let tipoMarca = '<img src="images/close.png">';
        let tipoMarca = turno.getMarca();
        //en este punto, turno apunta al jugador que está jugando.
        
        if (turno.ultimoMarcado===2) { //esta funcion hace que la variable vaya de 0 a 2 y a 0 de nuevo para recorrer el vector
            turno.ultimoMarcado = 0;
        } else {
            turno.ultimoMarcado += 1;
        }

        
        if (turno.elementosMarcados[turno.ultimoMarcado] != 0) { //porque al principio está seteado a 0.
            turno.elementosMarcados[turno.ultimoMarcado].classList.remove(turno.getNombre()); //removemos la clase del jugador
            turno.elementosMarcados[turno.ultimoMarcado].disabled = false;
            turno.elementosMarcados[turno.ultimoMarcado].innerHTML = "";
        }
        //ahora al elemento en la posicion ultimoMarcado + 1, lo almacenamos. Si el ultimo fue el 2, entonces vamos al 0
        turno.elementosMarcados[turno.ultimoMarcado] = div; //se reemplaza el div antiguo con el nuevo.
        div.classList.add(turno.getNombre());
        div.disabled = true; //desactivamos el div para que no lo vuelvan a marcar.
        div.innerHTML = '<img src="' + tipoMarca + '">'; //seteamos a la imagen dentro del div con la marca correspondiente
        //a el objeto le toque jugar. (cruz o circulo)

        let victoria = controlarResultados();
        if (victoria === 0) {
            turno = turno.getOponente();
            document.getElementById("anuncio").innerHTML = "Es el turno de: " + turno.getNombre();
        }

    }
}

//controlo x11 = x12 = x13, el substring "1,2", que es el numero 1.
//O que x12 = x22 = x32, el substring "2,3", que es el numero 2.
//O que x11, los dos subindices sean 1, Y x22 los dos subindices sean 2, Y que x33 los dos sean 3.
function controlarResultados() { //controla que haya 3 en fila, o columna o en diagonal EN BASE A SUS IDs.
    if(turno.elementosMarcados[2]!=0) {
        if (turno.elementosMarcados[0].id.substring(1,2) === turno.elementosMarcados[1].id.substring(1,2) &&
        turno.elementosMarcados[0].id.substring(1,2) === turno.elementosMarcados[2].id.substring(1,2) ||
        turno.elementosMarcados[0].id.substring(2,3) === turno.elementosMarcados[1].id.substring(2,3) &&
        turno.elementosMarcados[0].id.substring(2,3) === turno.elementosMarcados[2].id.substring(2,3) ||
        turno.elementosMarcados[0].id.substring(1,2) === turno.elementosMarcados[0].id.substring(2,3) &&
        turno.elementosMarcados[1].id.substring(1,2) === turno.elementosMarcados[1].id.substring(2,3) &&
        turno.elementosMarcados[2].id.substring(1,2) === turno.elementosMarcados[2].id.substring(2,3) ||
        +turno.elementosMarcados[0].id.substring(1,2) + +turno.elementosMarcados[0].id.substring(2,3) == 4 &&
        +turno.elementosMarcados[1].id.substring(1,2) + +turno.elementosMarcados[1].id.substring(2,3) == 4 &&
        +turno.elementosMarcados[2].id.substring(1,2) + +turno.elementosMarcados[2].id.substring(2,3) == 4) {
            audio.play();
            document.getElementById("anuncio").innerHTML = "EL GANADOR ES: " + turno.getNombre();
            document.getElementById("anuncio").style.color = "green";
            let botones = document.getElementById("tablero").childNodes;
            botones.forEach(boton => { //esta funcion es un for que recorre todo el array, el indice se llama "boton"
                boton.disabled = true;
            });
            return 1;
        }
    }
    return 0;
}