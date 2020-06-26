'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {

    async register({ request, response }){
        const trx = await Database.beginTransaction()
        try{
            const { name, surname, email, password } = request.all()
            const user = await User.create({ name, surname, email, password }, trx)
            const userRole = await Role.findBy('slug', 'client')
            await user.roles().attach([userRole.id], null, trx)
            await trx.commit()
            return response.status(201).send({ data: user })
        } catch(e){
            await trx.rollback()
            return response.status(400).send({ message: 'Erro ao realizar cadastro' })
        }
    }

    async login({ request, response, auth }){
        const { email, password } = request.all()

        let data = await auth.withRefreshToken().attempt(email, password)

        return response.send({ data })
    }

    async refresh({ request, response, auth }){
        let refreshToken = request.input('refresh_token')

        if(!refreshToken){
            refreshToken = request.header('refresh_token')
        }

        const user = await auth.newRefreshToken().generateRefreshToken(refreshToken)

        return response.send({ data: user })
    }

    async logout({ request, response, auth }){
        let refreshToken = request.input('refresh_token')

        if(!refreshToken){
            refreshToken = request.header('refresh_token')
        }

        const logout = await auth.authenticator('jwt').revokeTokens([refreshToken], true)

        return response.status(204).send({})
    }

    async forgot({ request, response }){

    }

    async rememnber({ request, response }){

    }

}

module.exports = AuthController
