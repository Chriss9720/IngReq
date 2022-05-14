const Usuario = require('../models/Usuarios');
const Carrito = require('../models/Carrito');
const Articulo = require('../models/Articulo');

const addCarrito = async(idU, datos) => {
    let usuario = await Usuario.findById(idU).select('carrito -_id');
    let idCarrito;
    if (!usuario.carrito) {
        await crearCarrito()
            .then(car => idCarrito = car._id)
            .catch(e => console.log(e));
        if (idCarrito) {
            await ligarCarritoUsuario(idCarrito, idU)
                .then(x => console.log("ligado"))
                .catch(e => console.log(e));
        }
    } else {
        idCarrito = usuario.carrito._id;
    }
    if (idCarrito) {
        await addArticulo(idCarrito, datos.idP, datos.cantidad);
    }
};

const crearCarrito = async() => {
    let carrito = new Carrito();
    return carrito.save();
};

const ligarCarritoUsuario = async(idC, idU) => {
    let update = await Usuario.findOneAndUpdate({ _id: idU }, {
        $set: {
            carrito: idC
        }
    }, { new: true });
    return update;
};

const addArticulo = (idC, idA, cantidad) => {
    let actualizar = Carrito.findByIdAndUpdate(idC, {
        $addToSet: {
            articulos: {
                $each: [{
                    idA,
                    cantidad
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const comprar = async(idU) => {
    let usuario = await Usuario.findById(idU).select('carrito -_id');
    let idCarrito = usuario.carrito._id;
    let carrito = await Carrito.findById(idCarrito).select("articulos");
    for (let i = 0; i < carrito.articulos.length; i++) {
        let art = carrito.articulos[i];
        let idP = art.idA;
        let arts = await Articulo.findById(idP);
        let cantidad = arts.cantidad - art.cantidad;
        await Articulo.findByIdAndUpdate(idP, {
            $set: { cantidad }
        });
    };
    carrito.articulos = [];
    await carrito.save();
};

module.exports = {
    addCarrito,
    crearCarrito,
    addArticulo,
    comprar
}