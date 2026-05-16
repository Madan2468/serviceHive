import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';

// @desc    Get all leads with pagination, filtering, search, and sorting
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: any, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status, source, search, sort } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions: any = { createdAt: -1 }; // Default to Latest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const leads = await Lead.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: any, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: any, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, status, source } = req.body;

  try {
    const lead = new Lead({
      name,
      email,
      status,
      source,
      createdBy: req.user._id,
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: any, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    // Role check: Only Admin or the creator can update
    if (req.user.role !== 'Admin' && lead.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this lead' });
      return;
    }

    lead.name = req.body.name || lead.name;
    lead.email = req.body.email || lead.email;
    lead.status = req.body.status || lead.status;
    lead.source = req.body.source || lead.source;

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req: any, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    // Role check: Only Admin or the creator can delete
    if (req.user.role !== 'Admin' && lead.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this lead' });
      return;
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export/csv
// @access  Private
export const exportLeadsCSV = async (req: any, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const leads = await Lead.find(query).sort(sortOptions).populate('createdBy', 'name');

    const fields = ['name', 'email', 'status', 'source', 'createdBy.name', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
