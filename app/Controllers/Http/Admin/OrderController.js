'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Order = use('App/Models/Order');
const DataBase = use('Database');

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, pagination }) {

    const { status, id } = request.only(['status', 'id']);

    const query = Order.query();

    if(status && id){
      query.where('status', status)
      query.orWhere('id', 'LIKE', `%${id}%`);
    } else if(status){
      query.where('status', status)
    } else if(id){
      query.where('id', 'LIKE', `%${id}%`)
    }

    const orders = await query.paginate(pagination.page, pagination.limit);

    return response.send(orders);

  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

    

  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response }) {

    const order = await Order.findOrFail(id);

    return response.send(order);

  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {

    const order = await Order.findOrFail(id);

    const trx = await Data.beginTransaction();

    try{
      await order.item().delete(trx);
      await order.coupons().delete(trx);
      await order.delete();

      await trx.commit();
      return response.status(204).send()
    } catch(e){
      await trx.rollback()
      return response.status(400).send({message: 'Erro ao deletar este pedido'})
    }

  }
}

module.exports = OrderController
