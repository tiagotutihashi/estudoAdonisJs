'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination }) {

    const name = request.input('name');

    const query = Product.query();

    if(name){
      query.where('name', 'LIKE', `%${name}%`);
    }

    const products = await query.paginate(pagination.page, pagination.limit);

    return response.send(products);

  }
  
  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

    try{

    const { name, description, price, image_id } = request.all();

    const product = await Product.create({name, description, price, image_id});

    return response.status(201).send(product);

    } catch(e){
      response.status(400).send({message: 'Não foi possível criar o produto'})
    }

  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: {id}, response }) {

    const product = await Product.findOrFail(id);

    return response.send(product);

  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response }) {
    
    try{
      const product = await Product.findOrFail(id);
      const { name, description, price, image_id } = request.all();
      product.merge({name, description, price, image_id });
      await product.save();
      return response.send(product);
    } catch(e){
      return response.status(400).send({ message: 'Não foi possível atualizar este produto' })
    }

  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: {id}, response }) {

    const product = await Product.findOrFail(id);

    try{
      await product.delete();
      return response.status(204).send();
    } catch(e){
      return response.status(500).send({ message: 'Não foi possível deletar esse produto'})
    }

  }
}

module.exports = ProductController
