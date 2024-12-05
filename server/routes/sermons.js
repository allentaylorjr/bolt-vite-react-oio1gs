import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../lib/supabase.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

const router = express.Router();

// Validation middleware
const validateSermon = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('church_id').notEmpty().withMessage('Church ID is required'),
  body('video_url').optional().isURL().withMessage('Valid video URL is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Invalid sermon data');
    }
    next();
  }
];

// Create sermon
router.post('/', validateSermon, async (req, res, next) => {
  try {
    const {
      title,
      description,
      speaker,
      series,
      date,
      video_url,
      church_id
    } = req.body;

    // Verify church exists
    const { data: church, error: churchError } = await supabase
      .from('churches')
      .select('id')
      .eq('id', church_id)
      .single();

    if (churchError || !church) {
      throw new NotFoundError('Church not found');
    }

    // Insert sermon
    const { data: sermon, error } = await supabase
      .from('sermons')
      .insert({
        title,
        description,
        speaker,
        series,
        date,
        video_url,
        church_id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(sermon);
  } catch (error) {
    next(error);
  }
});

// Get sermons for church
router.get('/:churchId', async (req, res, next) => {
  try {
    const { data: sermons, error } = await supabase
      .from('sermons')
      .select(`
        *,
        speaker:speaker_id(id, name),
        series:series_id(id, name)
      `)
      .eq('church_id', req.params.churchId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(sermons);
  } catch (error) {
    next(error);
  }
});

export default router;