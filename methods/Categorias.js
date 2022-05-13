const Categorias = require('../models/Categorias');
const Usuario = require('../models/Usuarios');
const Articulo = require('../models/Articulo');

const actualizarCat = async(newCat, oldCat, idA, idU) => {
    borrarArtCat(oldCat, idA);
    validarCategorias(idA, newCat, idU);
};

const validarCategorias = async(idA, cat, idU) => {
    let userData = await Usuario.findById({ _id: idU })
        .populate({
            path: 'categorias.cat',
            model: 'Categorias',
            select: { __v: 0 }
        });
    let catUser = [];
    userData.categorias.forEach(uC => catUser.push({ nombre: uC.cat.nombre, _id: uC.cat._id }));
    cat.forEach(c => {
        let find = catUser.find(f => f.nombre == c.c);
        if (find) {
            siExisteCat(find._id, idA);
        } else {
            noExisteCat(c.c, idU, idA);
        }
    });
};

const noExisteCat = (nombreC, idU, idA) => {
    crearCategoria(nombreC)
        .then(idCat => {
            ligarCategoriasUser(idU, idCat._id)
                .then(lu => {
                    siExisteCat(idCat.id, idA);
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

const siExisteCat = (idCat, idA) => {
    ligarCategoriasProd(idA, idCat)
        .then(lp => {
            ligarCatArt(idA, idCat)
                .then(lA => {
                    console.log("todo ok");
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

const ligarCatArt = async(idA, idC) => {
    let actualizar = await Articulo.findByIdAndUpdate(idA, {
        $addToSet: {
            categorias: {
                $each: [{
                    cat: idC
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const ligarCategoriasUser = async(idU, idC) => {
    let actualizar = await Usuario.findByIdAndUpdate(idU, {
        $addToSet: {
            categorias: {
                $each: [{
                    cat: idC
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const ligarCategoriasProd = async(idA, idC) => {
    let actualizar = await Categorias.findByIdAndUpdate(idC, {
        $addToSet: {
            articulos: {
                $each: [{
                    idA: idA
                }]
            }
        }
    }, { new: true });
    return actualizar;
};

const crearCategoria = async(nombre) => {
    let Schema = new Categorias({ nombre });
    return await Schema.save();
};

const borrarArtCat = async(cat, idA) => {
    await cat.forEach(async(c) => {
        let categoria = await Categorias.findById({ _id: c.cat });
        if (categoria) {
            categoria.articulos = categoria.articulos.filter(cId => cId.idA.toString() !== idA.toString());
            await categoria.save();
        }
    });
    let articulo = await Articulo.findById({ _id: idA });
    if (articulo) {
        articulo.categorias = [];
        await articulo.save();
    }
};

module.exports = {
    actualizarCat,
    validarCategorias,
    noExisteCat,
    siExisteCat,
    ligarCatArt,
    ligarCategoriasUser,
    ligarCategoriasProd,
    crearCategoria,
    borrarArtCat
}