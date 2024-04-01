import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {
    console.log(req.query);
    try {
        const filterBy = {
            txt: req.query.params.filterBy.txt || '',
            labels: req.query.params.filterBy.labels || '',
            inStock: req.query.params.filterBy.inStock || '',
            // pageIdx: req.query.params.filterBy.pageIdx || '',
        }

        const sortBy = {
            by: req.query.params.sortBy.by || '',
            asc: req.query.params.sortBy.asc || ''
        }


        logger.debug('Getting Toys', filterBy)
        const toys = await toyService.query(filterBy, sortBy)
        res.json(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        // console.log('err',err);
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req
    // console.log(req);
    // console.log(loggedinUser, '🥰');
    // const {creator, inStock, price} = req.body

    try {
        const toy = req.body
        toy.creator = loggedinUser
        toy.inStock = true
        toy.price = parseInt(toy.price) || 0
        // console.log(typeof(toy.price), toy.price, '😍');
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}


export async function updateToy(req, res) {
    try {
        const toy = req.body
        console.log(toy);
        toy.price = parseInt(toy.price) || 0

        const updatedToy = await toyService.update(toy)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    try {
        const toyId = req.params.id
        await toyService.remove(toyId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}


export async function removeToyMsg(req, res) {
    const { loggedinUser } = req
    // console.log('fffffffffffffffffffffffff');
    try {
        const toyId = req.params.id
        const { msgId } = req.params

        const removedId = await toyService.removeToyMsg(toyId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}

// function extractTimestamp(toyId) {
//     const timestamp = new Date(parseInt(toyId.substring(0, 8), 16) * 1000);
//     return timestamp;
// }