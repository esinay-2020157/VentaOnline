'use strict'

const { validateData, searchUser, encrypt, checkPassword, checkPermission, checkUpdate } = require('../utils/validate');
const User = require('../models/user.model');
const jwt = require('../services/jwt');
const Invoice = require('../models/invoice.model');

/* --------------------TEST-------------------- */
exports.test = (req, res) => {
    console.log(req);
    return res.send({ message: 'The function test is running' });
}

/* --------------------REGISTER-------------------- */
exports.register = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        }
        const msg = validateData(data);
        if (!msg) {
            let userExist = await searchUser(params.username);
            if (!userExist) {
                data.surname = params.surname;
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);
                let user = new User(data);
                await user.save();
                return res.send({ message: 'User create successfully' });
            } else {
                return res.send({ message: 'The username is already in use' });
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }

}

/* --------------------GUARDAR-------------------- */
exports.saveUser = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: params.role
        }
        const msg = validateData(data);

        if (data.role == 'CLIENT' || data.role == 'ADMIN') {
            if (!msg) {
                let userExist = await searchUser(params.username);
                if (!userExist) {
                    data.surname = params.surname;
                    data.email = params.email;
                    data.phone = params.phone;
                    data.password = await encrypt(params.password);
                    let user = new User(data);
                    await user.save();
                    return res.send({ message: 'User created sucessfully' });
                } else {
                    return res.send({ message: 'Username already in use, choose another username' });
                }
            } else {
                return res.status(400).send(msg);
            }
        } else {
            return res.send({ message: 'Please, enter a valid role' });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

/* --------------------LOGIN-------------------- */

exports.login = async(req,res)=>{
    try{
      const params = req.body;
      const data = {
        username: params.username,
        password: params.password
    }
    let msg = validateData(data);

      if(!msg){
        let userExist = await searchUser(params.username);
        if(userExist && await checkPassword(params.password, userExist.password)){
          const token = await jwt .createToken(userExist);
          const billId = params.user;
          const bill = await Invoice.find({bill: billId})
          return res.send({token,bill }); 
        }else{
          return res.send({message: 'Name or password do not match'});
        }
      }else{
          return res.status(400).send(msg);
      }
    }catch(err){
      console.log(err);
      return err;
    }


}

/* --------------------ACTUALIZAR-------------------- */
exports.update = async (req, res) => {
    try {
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if (permission === false) return res.status(401).send({ message: 'Unauthorized to update this user' });
        else {
            const notUpdated = await checkUpdate(params);
            if (notUpdated === false) return res.status(400).send({ message: 'This params can only update by admin' });
            else {
                const already = await searchUser(params.username);
                if (!already) {
                    const userUpdate = await User.findOneAndUpdate({ _id: userId }, params, { new: true })
                        .lean()
                    return res.send({ userUpdate, message: 'User updated' });
                } else {
                    return res.send({ message: 'Username is taken' });
                }
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

/* --------------------ELIMINAR-------------------- */
exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if (permission === false) {
            return res.status(401).send({ message: 'Unauthorized to delete the user' });
        } else {
            const userDeleted = await User.findOneAndDelete({ _id: userId });
            if (!userDeleted) {
                return res.status(500).send({ message: 'User not found or already deleted' })
            } else {
                return res.send({ userDeleted, message: 'Account deleted' })
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}


