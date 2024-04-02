import User from '../models/user.js';
import querystring from 'query-string';
export async function getUsers(req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Default page number is 1
        const pageSize = parseInt(req.query.pageSize) || 20; // Default page size is 20
        // let filters = req.query.filters || ''; // Get filters from query parameters as encoded string
        const search = req.query.search || ''; // Get search keyword from query parameters
        const startIndex = (page - 1) * pageSize;
        const domain = req.query.domain || ''; // Get domain filter from query parameters
        const gender = req.query.gender || ''; //
        const available = req.query.available || ''; //

        // Decode and parse the filters string into an object
        // filters = filters ? JSON.parse(decodeURIComponent(filters)) : {};
        // filters= querystring.parse(filters);

        let query = {}; // Start with an empty query object

        // Apply filters if provided
        if (domain) {
            query.domain = domain;
        }
        if (gender) {
            query.gender = gender;
        }
        if (available) {
            query.available = available;
        }
        // Add more filters as needed

        // Apply search keyword if provided
        if (search) {
            query = {
                ...query,
                $or: [
                    { first_name: { $regex: search, $options: 'i' } },
                    { last_name: { $regex: search, $options: 'i' } },
                    { domain: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Get total number of users after applying filters
        const totalUsers = await User.countDocuments(query);
        // Retrieve users with pagination
        const users = await User.find(query)
            .skip(startIndex)
            .limit(pageSize);

        const pagination = {
            currentPage: page,
            pageSize: pageSize,
            totalPages: Math.ceil(totalUsers / pageSize)
        };

        res.json({ users, pagination, totalUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export async function getAllFilters(req, res) {
    try {
        const domains = await User.distinct('domain');
        const genders = await User.distinct('gender');
        const availables = await User.distinct('available');
        
        res.status(200).json({ domains, genders, availables });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}