const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Producto = require('../models/producto');
const app = express();

app.post('/producto', (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: body.usuario
    });

    producto.save((err, proDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err

            });
        }
        return res.status(200).json({
            ok: true,
            proDB
        });
    });
});

app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'categoria', 'disponibilidad', 'usuario']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, prodDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            prodDB
        });
    });
});

app.get('/producto', (req, res) => {
    Producto.find({ disponible: true })
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                count: productos.length,
                productos
            });

        });
});

app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, resp) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            resp
        });
    });

});
module.exports = app;