import { Router } from 'express';
import User from '../models/user.js';
import Team from '../models/team.js';
import { getUsers, getAllFilters } from '../controllers/users.js';
const router = Router();
// DELETE /api/users/:id - Delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
const checkValid=(users)=>{
    const domainByAvailability = [];
    // users.forEach(user=>domainByAvailability.push(user.domain+user.available?'true':'false'));

    const domainSet = new Set(domainByAvailability);
    if(domainSet.size!==domainByAvailability.length){
        return false;
    }
    else{
        return true;
    }


}
// POST /api/team - Create a new team
router.post('/team', async (req, res) => {
    try {
        const userIds = req.body.users;
        const users= await User.find({ _id: { $in: userIds } });
        console.log(users);
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(!checkValid(users)){
            return res.status(400).json({message:'Invalid Users'});
        }
        const team = new Team({ members: userIds });
        await team.save();
        res.status(200).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

});

// GET /api/team/:id - Retrieve details of a specific team by ID
router.get('/team/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate([{path: 'members', strictPopulate: false}]);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/user', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.put('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get("/users",getUsers);
router.get("/filters",getAllFilters);

export default router;
