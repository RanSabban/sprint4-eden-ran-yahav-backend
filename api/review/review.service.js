import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
        // const reviews = await collection.find(criteria).toArray()
        console.log('HEGATI');
        var reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'aboutToyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'aboutToy'
                }
            },
            {
                $unwind: '$aboutToy'
            },
            {
                $project: {
                    _id: true,
                    txt: 1,
                    byUser: { _id: 1, fullname: 1 },
                    aboutToy: { _id: 1, name: 1 },
                }
            }
        ]).toArray()

        // reviews = reviews.map(review => {
        //     review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
        //     review.aboutToy = { _id: review.aboutToy._id, name: review.aboutToy.name }
        //     delete review.byUserId
        //     delete review.aboutToyId
        //     return review
        // })

        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { loggedinUser } = store
        const { loggedinUser } = asyncLocalStorage.getStore()
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: new Object(reviewId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = new ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {
        const reviewToAdd = {
            byUserId: new ObjectId(review.byUserId),
            aboutToyId: new ObjectId(review.aboutToyId),
            txt: review.txt
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        console.log("reviewtoadd", reviewToAdd);
        return reviewToAdd
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = new ObjectId(filterBy.byUserId)
    return criteria
}

export const reviewService = {
    query,
    remove,
    add
}


