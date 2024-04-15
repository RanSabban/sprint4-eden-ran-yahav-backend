import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

async function query(filterBy = { txt: '', inStock: '' }, sortBy = { by: '', asc: 1 }) {
    try {
        // console.log('sortBy', sortBy);
        // let criteria = {
        //     name: { $regex: filterBy.txt, $options: 'i' }
        // };

        // if (filterBy.inStock !== 'all' && filterBy.inStock !== 'all' && filterBy.inStock !== '') {
        //     criteria.inStock = { $eq: JSON.parse(filterBy.inStock) };
        //     console.log('criteria.inStock', criteria.inStock);
        // }

        // if (filterBy.labels && filterBy.labels.length > 0) {
        //     criteria.labels = { $all: filterBy.labels };
        // }

        const collection = await dbService.getCollection('boards');

        // Fetching all documents in the collection and converting them to an array
        const boards = await collection.find({}).toArray();
        return boards;
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('boards')
        var board = collection.findOne({ _id: new ObjectId(boardId) })
        // board.createdAt = new Object(board._id.getTimestamp())
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('boards')
        await collection.deleteOne({ _id: new ObjectId(boardId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        console.log(board);
        const collection = await dbService.getCollection('boards')
        await collection.insertOne(board)
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = {
            name: board.name,
            price: board.price,
            labels: board.labels,
            reviews: board.reviews,
        }
        const collection = await dbService.getCollection('boards')
        await collection.updateOne({ _id: new ObjectId(board._id) }, { $set: boardToSave })
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function addBoardMsg(boardId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('boards')
        await collection.updateOne({ _id: new ObjectId(boardId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add board msg ${boardId}`, err)
        throw err
    }
}

async function removeBoardMsg(boardId, msgId) {
    try {
        const collection = await dbService.getCollection('boards')
        await collection.updateOne({ _id: new ObjectId(boardId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot remove board msg ${boardId}`, err)
        throw err
    }
}


export const boardService = {
    remove,
    query,
    getById,
    add,
    update,
    addBoardMsg,
    removeBoardMsg,
}
