// userShowController.js
import { UserShow } from '../models/show.model.js';

// Controller functions

// Get all shows added by a specific user with optional filters
const getAllUserShows = async (req, res) => {
  const { userId } = req.params;
  const { status, favorite } = req.query;

  let filter = { userId };
  if (status) filter.status = status;
  if (favorite !== undefined) filter.favorite = favorite === 'true';

  try {
    const userShows = await UserShow.find(filter);
    res.json(userShows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all showIds added by a specific user with optional filters
const getAllUserShowsId = async (req, res) => {
  const { userId } = req.params;
  const { status, favorite } = req.query;

  let filter = { userId };
  if (status) filter.status = status;
  if (favorite !== undefined) filter.favorite = favorite === 'true';

  try {
    const userShows = await UserShow.find(filter, 'showId');
    const showIds = userShows.map(userShow => userShow.showId.toString());
    res.json(showIds);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a user's relationship with a show
const addUserShow = async (req, res) => {
  const { userId, showId, showName, showGenres , status, episode, favorite, rating } = req.body;

  try {
    const existingUserShow = await UserShow.findOne({ userId, showId });

    if (existingUserShow) {
      
      existingUserShow.status = status || existingUserShow.status;
      existingUserShow.episode = episode || existingUserShow.episode;
      existingUserShow.favorite = favorite !== undefined ? favorite : existingUserShow.favorite;
      existingUserShow.rating = rating || existingUserShow.rating;

      await existingUserShow.save();
      res.json(existingUserShow);
    } else {
      // If no relationship exists, create a new one
      const newUserShow = new UserShow({ userId, showId, showName, showGenres , status, episode, favorite, rating });
      await newUserShow.save();
      res.status(201).json(newUserShow);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a user's relationship with a specific show by ID
const getUserShowById = async (req, res) => {
  const { userId, showId } = req.params;

  try {
    const userShow = await UserShow.findOne({ userId, showId });
    if (!userShow) {
      return res.status(404).json({ error: 'UserShow not found' });
    }

    res.json(userShow);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export controller functions
export { getAllUserShows, addUserShow, getUserShowById, getAllUserShowsId };
